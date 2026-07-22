package com.hospital.controller;

import com.hospital.dto.MessageResponse;
import com.hospital.entity.*;
import com.hospital.model.Role;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/receptionist")
public class ReceptionistController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- PATIENT MANAGEMENT ---
    @PostMapping("/patients")
    @Transactional
    public ResponseEntity<?> registerPatient(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already registered!"));
        }

        // Create User
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode((String) payload.get("password")));
        user.setRole(Role.PATIENT);
        user.setActive(true);
        userRepository.save(user);

        // Create Patient
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setName((String) payload.get("name"));
        patient.setAge(Integer.parseInt(payload.get("age").toString()));
        patient.setGender((String) payload.get("gender"));
        patient.setBloodGroup((String) payload.get("bloodGroup"));
        patient.setAddress((String) payload.get("address"));
        patient.setContactNumber((String) payload.get("contactNumber"));
        patient.setEmergencyContact((String) payload.get("emergencyContact"));
        patient.setInsuranceDetails((String) payload.get("insuranceDetails"));
        patient.setMedicalHistory((String) payload.get("medicalHistory"));
        patientRepository.save(patient);

        return ResponseEntity.ok(new MessageResponse("Patient registered successfully by receptionist!"));
    }

    @GetMapping("/patients/search")
    public ResponseEntity<List<Patient>> searchPatients(@RequestParam("query") String query) {
        return ResponseEntity.ok(patientRepository.findByNameContainingIgnoreCase(query));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    // --- APPOINTMENT MANAGEMENT ---
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> payload) {
        Long patientId = Long.parseLong(payload.get("patientId").toString());
        Long doctorId = Long.parseLong(payload.get("doctorId").toString());
        Long departmentId = Long.parseLong(payload.get("departmentId").toString());
        LocalDate date = LocalDate.parse(payload.get("appointmentDate").toString());
        String timeSlot = (String) payload.get("timeSlot");
        String reason = (String) payload.get("reason");

        Optional<Patient> patOpt = patientRepository.findById(patientId);
        Optional<Doctor> docOpt = doctorRepository.findById(doctorId);
        Optional<Department> deptOpt = departmentRepository.findById(departmentId);

        if (patOpt.isEmpty() || docOpt.isEmpty() || deptOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Patient, Doctor, or Department not found."));
        }

        // Verify slot is free
        List<Appointment> existing = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);
        for (Appointment app : existing) {
            if (app.getTimeSlot().equalsIgnoreCase(timeSlot) && !app.getStatus().equalsIgnoreCase("CANCELLED")) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Time slot already booked."));
            }
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patOpt.get());
        appointment.setDoctor(docOpt.get());
        appointment.setDepartment(deptOpt.get());
        appointment.setAppointmentDate(date);
        appointment.setTimeSlot(timeSlot);
        appointment.setReason(reason);
        appointment.setStatus("APPROVED"); // Auto approved by Receptionist

        appointmentRepository.save(appointment);

        // Notify patient
        Notification pNotif = new Notification();
        pNotif.setUser(patOpt.get().getUser());
        pNotif.setMessage("An appointment has been booked for you with Dr. " + docOpt.get().getName() + " on " + date + " at " + timeSlot);
        notificationRepository.save(pNotif);

        return ResponseEntity.ok(new MessageResponse("Appointment booked and approved successfully!"));
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> statusPayload) {
        Optional<Appointment> appOpt = appointmentRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Appointment appointment = appOpt.get();
        String status = statusPayload.get("status");
        appointment.setStatus(status);
        appointmentRepository.save(appointment);

        // Notify patient
        Notification notif = new Notification();
        notif.setUser(appointment.getPatient().getUser());
        notif.setMessage("Your appointment status has been updated to " + status + ".");
        notificationRepository.save(notif);

        return ResponseEntity.ok(new MessageResponse("Appointment status updated to " + status));
    }

    // --- ADMISSION & DISCHARGE WORKFLOW ---
    @PatchMapping("/appointments/{id}/admit")
    public ResponseEntity<?> admitPatient(@PathVariable Long id) {
        Optional<Appointment> appOpt = appointmentRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Appointment appointment = appOpt.get();
        appointment.setStatus("APPROVED");
        appointment.setReason("Admitted: " + (appointment.getReason() != null ? appointment.getReason() : "General admission"));
        appointmentRepository.save(appointment);

        Notification notif = new Notification();
        notif.setUser(appointment.getPatient().getUser());
        notif.setMessage("You have been admitted to the hospital under Dr. " + appointment.getDoctor().getName() + ".");
        notificationRepository.save(notif);

        return ResponseEntity.ok(new MessageResponse("Patient successfully admitted."));
    }

    @PatchMapping("/appointments/{id}/discharge")
    @Transactional
    public ResponseEntity<?> dischargePatient(@PathVariable Long id, @RequestBody Map<String, Double> billingInfo) {
        Optional<Appointment> appOpt = appointmentRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Appointment appointment = appOpt.get();
        appointment.setStatus("COMPLETED");
        appointmentRepository.save(appointment);

        // Generate Bill automatically on discharge
        Bill bill = new Bill();
        bill.setPatient(appointment.getPatient());
        bill.setAppointment(appointment);

        double consult = appointment.getDoctor().getConsultationFee();
        double meds = billingInfo.getOrDefault("medicineCharges", 0.0);
        double lab = billingInfo.getOrDefault("laboratoryCharges", 0.0);
        double surgery = billingInfo.getOrDefault("surgeryCharges", 0.0);
        double room = billingInfo.getOrDefault("roomCharges", 0.0);
        double additional = billingInfo.getOrDefault("additionalCharges", 0.0);
        double discount = billingInfo.getOrDefault("discount", 0.0);

        double subtotal = consult + meds + lab + surgery + room + additional - discount;
        double gst = subtotal * 0.18; // 18% GST
        double total = subtotal + gst;

        bill.setConsultationCharges(consult);
        bill.setMedicineCharges(meds);
        bill.setLaboratoryCharges(lab);
        bill.setSurgeryCharges(surgery);
        bill.setRoomCharges(room);
        bill.setAdditionalCharges(additional);
        bill.setDiscount(discount);
        bill.setGst(gst);
        bill.setTotalAmount(total);
        bill.setStatus("PENDING");

        billRepository.save(bill);

        Notification notif = new Notification();
        notif.setUser(appointment.getPatient().getUser());
        notif.setMessage("You have been discharged. A pending bill of Rs. " + String.format("%.2f", total) + " has been generated.");
        notificationRepository.save(notif);

        return ResponseEntity.ok(bill);
    }

    // --- BILLING MANAGEMENT ---
    @GetMapping("/bills")
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billRepository.findAll());
    }

    @PostMapping("/bills")
    public ResponseEntity<?> createBill(@RequestBody Map<String, Object> payload) {
        Long patientId = Long.parseLong(payload.get("patientId").toString());
        Optional<Patient> patOpt = patientRepository.findById(patientId);
        if (patOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Patient not found."));
        }

        Bill bill = new Bill();
        bill.setPatient(patOpt.get());

        if (payload.containsKey("appointmentId") && payload.get("appointmentId") != null) {
            Long appVal = Long.parseLong(payload.get("appointmentId").toString());
            appointmentRepository.findById(appVal).ifPresent(bill::setAppointment);
        }

        double consult = Double.parseDouble(payload.getOrDefault("consultationCharges", 0.0).toString());
        double meds = Double.parseDouble(payload.getOrDefault("medicineCharges", 0.0).toString());
        double lab = Double.parseDouble(payload.getOrDefault("laboratoryCharges", 0.0).toString());
        double surgery = Double.parseDouble(payload.getOrDefault("surgeryCharges", 0.0).toString());
        double room = Double.parseDouble(payload.getOrDefault("roomCharges", 0.0).toString());
        double additional = Double.parseDouble(payload.getOrDefault("additionalCharges", 0.0).toString());
        double discount = Double.parseDouble(payload.getOrDefault("discount", 0.0).toString());

        double subtotal = consult + meds + lab + surgery + room + additional - discount;
        double gst = subtotal * 0.18;
        double total = subtotal + gst;

        bill.setConsultationCharges(consult);
        bill.setMedicineCharges(meds);
        bill.setLaboratoryCharges(lab);
        bill.setSurgeryCharges(surgery);
        bill.setRoomCharges(room);
        bill.setAdditionalCharges(additional);
        bill.setDiscount(discount);
        bill.setGst(gst);
        bill.setTotalAmount(total);
        bill.setStatus("PENDING");

        billRepository.save(bill);

        Notification notif = new Notification();
        notif.setUser(patOpt.get().getUser());
        notif.setMessage("A new bill of Rs. " + String.format("%.2f", total) + " has been generated for you.");
        notificationRepository.save(notif);

        return ResponseEntity.ok(bill);
    }

    @PostMapping("/bills/{id}/pay")
    @Transactional
    public ResponseEntity<?> payBill(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Bill> billOpt = billRepository.findById(id);
        if (billOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Bill bill = billOpt.get();
        bill.setStatus("PAID");
        billRepository.save(bill);

        Payment payment = new Payment();
        payment.setBill(bill);
        payment.setPaymentMethod(payload.getOrDefault("paymentMethod", "Cash"));
        payment.setTransactionId(payload.getOrDefault("transactionId", UUID.randomUUID().toString()));
        payment.setAmountPaid(bill.getTotalAmount());
        payment.setPaymentStatus("PAID");
        paymentRepository.save(payment);

        Notification notif = new Notification();
        notif.setUser(bill.getPatient().getUser());
        notif.setMessage("Payment of Rs. " + String.format("%.2f", bill.getTotalAmount()) + " received for Bill #" + bill.getId());
        notificationRepository.save(notif);

        return ResponseEntity.ok(new MessageResponse("Payment processed successfully!"));
    }
}

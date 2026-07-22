package com.hospital.controller;

import com.hospital.dto.MessageResponse;
import com.hospital.entity.*;
import com.hospital.repository.*;
import com.hospital.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/patient")
public class PatientController {

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
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private Patient getCurrentPatient() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        return patientRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Patient profile not found"));
    }

    // --- APPOINTMENTS ---
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments() {
        Patient patient = getCurrentPatient();
        return ResponseEntity.ok(appointmentRepository.findByPatientId(patient.getId()));
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> payload) {
        Patient patient = getCurrentPatient();

        Long doctorId = Long.parseLong(payload.get("doctorId").toString());
        Long departmentId = Long.parseLong(payload.get("departmentId").toString());
        LocalDate date = LocalDate.parse(payload.get("appointmentDate").toString());
        String timeSlot = (String) payload.get("timeSlot");
        String reason = (String) payload.get("reason");

        Optional<Doctor> docOpt = doctorRepository.findById(doctorId);
        Optional<Department> deptOpt = departmentRepository.findById(departmentId);

        if (docOpt.isEmpty() || deptOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Doctor or Department not found."));
        }

        // Verify slot is not already taken for this doctor
        List<Appointment> existingApps = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);
        for (Appointment app : existingApps) {
            if (app.getTimeSlot().equalsIgnoreCase(timeSlot) && !app.getStatus().equalsIgnoreCase("CANCELLED")) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Time slot is already booked for this doctor."));
            }
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(docOpt.get());
        appointment.setDepartment(deptOpt.get());
        appointment.setAppointmentDate(date);
        appointment.setTimeSlot(timeSlot);
        appointment.setReason(reason);
        appointment.setStatus("PENDING");

        appointmentRepository.save(appointment);

        // Notify doctor
        Notification notification = new Notification();
        notification.setUser(docOpt.get().getUser());
        notification.setMessage("New appointment booking request received from " + patient.getName() + " for " + date + " at " + timeSlot);
        notificationRepository.save(notification);

        return ResponseEntity.ok(new MessageResponse("Appointment booked successfully. Waiting for doctor approval."));
    }

    // --- MEDICAL RECORDS ---
    @GetMapping("/records")
    public ResponseEntity<List<MedicalRecord>> getMyRecords() {
        Patient patient = getCurrentPatient();
        return ResponseEntity.ok(medicalRecordRepository.findByPatientId(patient.getId()));
    }

    // --- BILLS ---
    @GetMapping("/bills")
    public ResponseEntity<List<Bill>> getMyBills() {
        Patient patient = getCurrentPatient();
        return ResponseEntity.ok(billRepository.findByPatientId(patient.getId()));
    }

    // --- NOTIFICATIONS ---
    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getMyNotifications() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId()));
    }

    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Long id) {
        Optional<Notification> notifOpt = notificationRepository.findById(id);
        if (notifOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Notification notification = notifOpt.get();
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!notification.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Unauthorized."));
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok(new MessageResponse("Notification marked as read."));
    }
}

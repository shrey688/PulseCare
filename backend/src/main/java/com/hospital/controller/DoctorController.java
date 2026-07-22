package com.hospital.controller;

import com.hospital.dto.MessageResponse;
import com.hospital.entity.*;
import com.hospital.repository.*;
import com.hospital.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private Doctor getCurrentDoctor() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Optional<Doctor> docOpt = doctorRepository.findByUser(user);
        if (docOpt.isPresent()) {
            return docOpt.get();
        }
        List<Doctor> doctors = doctorRepository.findAll();
        if (!doctors.isEmpty()) {
            return doctors.get(0);
        }
        throw new RuntimeException("Doctor profile not found");
    }

    // --- APPOINTMENTS ---
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments() {
        Doctor doctor = getCurrentDoctor();
        return ResponseEntity.ok(appointmentRepository.findByDoctorId(doctor.getId()));
    }

    @GetMapping("/appointments/today")
    public ResponseEntity<List<Appointment>> getTodayAppointments() {
        Doctor doctor = getCurrentDoctor();
        return ResponseEntity.ok(appointmentRepository.findByDoctorIdAndAppointmentDate(doctor.getId(), LocalDate.now()));
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> statusPayload) {
        Optional<Appointment> appOpt = appointmentRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Appointment appointment = appOpt.get();
        Doctor doctor = getCurrentDoctor();

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Unauthorized. This is not your appointment."));
        }

        String newStatus = statusPayload.get("status"); // APPROVED, CANCELLED, COMPLETED
        appointment.setStatus(newStatus);
        appointmentRepository.save(appointment);

        // Notify patient
        Notification notification = new Notification();
        notification.setUser(appointment.getPatient().getUser());
        notification.setMessage("Your appointment with " + doctor.getName() + " scheduled on " + appointment.getAppointmentDate() + " has been " + newStatus.toLowerCase() + ".");
        notificationRepository.save(notification);

        return ResponseEntity.ok(new MessageResponse("Appointment status updated to: " + newStatus));
    }

    // --- PATIENTS & MEDICAL RECORDS ---
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getPatients() {
        // Return patients who have had appointments with this doctor
        Doctor doctor = getCurrentDoctor();
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId());
        Set<Patient> patients = new HashSet<>();
        for (Appointment app : appointments) {
            patients.add(app.getPatient());
        }
        return ResponseEntity.ok(new ArrayList<>(patients));
    }

    @GetMapping("/patients/{patientId}/records")
    public ResponseEntity<List<MedicalRecord>> getPatientRecords(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicalRecordRepository.findByPatientId(patientId));
    }

    @PostMapping("/records")
    public ResponseEntity<?> addMedicalRecord(
            @RequestParam("patientId") Long patientId,
            @RequestParam("diagnosis") String diagnosis,
            @RequestParam(value = "prescription", required = false) String prescription,
            @RequestParam(value = "symptoms", required = false) String symptoms,
            @RequestParam(value = "doctorNotes", required = false) String doctorNotes,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Doctor doctor = getCurrentDoctor();
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Patient not found."));
        }
        Patient patient = patientOpt.get();

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setDiagnosis(diagnosis);
        record.setPrescription(prescription);
        record.setSymptoms(symptoms);
        record.setDoctorNotes(doctorNotes);

        if (file != null && !file.isEmpty()) {
            try {
                // Ensure directory exists
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }

                // Generate safe, unique filename
                String originalFilename = file.getOriginalFilename();
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String safeFilename = UUID.randomUUID().toString() + fileExtension;
                String filePath = Paths.get(uploadDir, safeFilename).toString();

                Files.copy(file.getInputStream(), Paths.get(filePath));
                record.setAttachmentPath("/uploads/" + safeFilename);

            } catch (IOException e) {
                return ResponseEntity.internalServerError().body(new MessageResponse("Error: Failed to upload file - " + e.getMessage()));
            }
        }

        medicalRecordRepository.save(record);

        // Notify patient
        Notification notification = new Notification();
        notification.setUser(patient.getUser());
        notification.setMessage("Dr. " + doctor.getName() + " has added a new medical record (Diagnosis: " + diagnosis + ") to your history.");
        notificationRepository.save(notification);

        return ResponseEntity.ok(new MessageResponse("Medical record added successfully!"));
    }
}

package com.hospital.controller;

import com.hospital.dto.MessageResponse;
import com.hospital.entity.*;
import com.hospital.model.Role;
import com.hospital.repository.*;
import com.hospital.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ReceptionistRepository receptionistRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getMyProfile() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole().name());

        if (user.getRole() == Role.PATIENT) {
            Optional<Patient> patientOpt = patientRepository.findByUser(user);
            if (patientOpt.isPresent()) {
                Patient p = patientOpt.get();
                profile.put("profileId", p.getId());
                profile.put("name", p.getName());
                profile.put("age", p.getAge());
                profile.put("gender", p.getGender());
                profile.put("bloodGroup", p.getBloodGroup());
                profile.put("address", p.getAddress());
                profile.put("contactNumber", p.getContactNumber());
                profile.put("emergencyContact", p.getEmergencyContact());
                profile.put("insuranceDetails", p.getInsuranceDetails());
                profile.put("medicalHistory", p.getMedicalHistory());
            }
        } else if (user.getRole() == Role.DOCTOR) {
            Optional<Doctor> doctorOpt = doctorRepository.findByUser(user);
            if (doctorOpt.isPresent()) {
                Doctor d = doctorOpt.get();
                profile.put("profileId", d.getId());
                profile.put("name", d.getName());
                profile.put("mobile", d.getMobile());
                profile.put("specialization", d.getSpecialization());
                profile.put("qualification", d.getQualification());
                profile.put("experience", d.getExperience());
                profile.put("availability", d.getAvailability());
                profile.put("consultationFee", d.getConsultationFee());
                profile.put("department", d.getDepartment() != null ? d.getDepartment().getName() : "None");
            }
        } else if (user.getRole() == Role.RECEPTIONIST) {
            Optional<Receptionist> receptionistOpt = receptionistRepository.findByUser(user);
            if (receptionistOpt.isPresent()) {
                Receptionist r = receptionistOpt.get();
                profile.put("profileId", r.getId());
                profile.put("name", r.getName());
                profile.put("contactNumber", r.getContactNumber());
            }
        } else {
            profile.put("name", "Administrator");
        }

        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<?> updateMyProfile(@RequestBody Map<String, Object> payload) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        if (user.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUser(user).orElseThrow();
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
        } else if (user.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorRepository.findByUser(user).orElseThrow();
            doctor.setName((String) payload.get("name"));
            doctor.setMobile((String) payload.get("mobile"));
            doctor.setAvailability((String) payload.get("availability"));
            doctorRepository.save(doctor);
        } else if (user.getRole() == Role.RECEPTIONIST) {
            Receptionist receptionist = receptionistRepository.findByUser(user).orElseThrow();
            receptionist.setName((String) payload.get("name"));
            receptionist.setContactNumber((String) payload.get("contactNumber"));
            receptionistRepository.save(receptionist);
        }

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Current password is incorrect."));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
    }
}

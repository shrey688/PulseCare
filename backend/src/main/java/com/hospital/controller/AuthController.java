package com.hospital.controller;

import com.hospital.dto.*;
import com.hospital.entity.*;
import com.hospital.model.Role;
import com.hospital.repository.*;
import com.hospital.security.JwtUtils;
import com.hospital.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ReceptionistRepository receptionistRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        if (!user.isActive()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User account is inactive. Please contact the administrator."));
        }

        String role = user.getRole().name();
        String name = "Administrator";
        Long profileId = null;

        if (user.getRole() == Role.PATIENT) {
            Optional<Patient> p = patientRepository.findByUser(user);
            if (p.isPresent()) {
                name = p.get().getName();
                profileId = p.get().getId();
            }
        } else if (user.getRole() == Role.DOCTOR) {
            Optional<Doctor> d = doctorRepository.findByUser(user);
            if (d.isPresent()) {
                name = d.get().getName();
                profileId = d.get().getId();
            }
        } else if (user.getRole() == Role.RECEPTIONIST) {
            Optional<Receptionist> r = receptionistRepository.findByUser(user);
            if (r.isPresent()) {
                name = r.get().getName();
                profileId = r.get().getId();
            }
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                role,
                name,
                profileId));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account with PATIENT role
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(Role.PATIENT);
        user.setActive(true);
        userRepository.save(user);

        // Create new patient details linked to this user
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setName(signUpRequest.getName());
        patient.setAge(signUpRequest.getAge());
        patient.setGender(signUpRequest.getGender());
        patient.setBloodGroup(signUpRequest.getBloodGroup());
        patient.setAddress(signUpRequest.getAddress());
        patient.setContactNumber(signUpRequest.getContactNumber());
        patient.setEmergencyContact(signUpRequest.getEmergencyContact());
        patient.setInsuranceDetails(signUpRequest.getInsuranceDetails());
        patient.setMedicalHistory(signUpRequest.getMedicalHistory());
        patientRepository.save(patient);

        return ResponseEntity.ok(new MessageResponse("Patient registered successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        Optional<User> userOpt = userRepository.findByEmail(forgotPasswordRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User with this email does not exist."));
        }

        User user = userOpt.get();
        // Since we don't have a mail server, we can reset to a simple default password and return it.
        String tempPass = "reset123";
        user.setPassword(encoder.encode(tempPass));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password reset successful. Your temporary password is: " + tempPass + ". Please login and change your password in settings."));
    }
}

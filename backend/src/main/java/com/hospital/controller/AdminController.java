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
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private ReceptionistRepository receptionistRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- APPOINTMENTS & RECORDS & BILLS FOR ADMIN ---
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
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
        return ResponseEntity.ok(new MessageResponse("Appointment status updated to " + status));
    }

    @GetMapping("/records")
    public ResponseEntity<List<MedicalRecord>> getAllMedicalRecords() {
        return ResponseEntity.ok(medicalRecordRepository.findAll());
    }

    @GetMapping("/bills")
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billRepository.findAll());
    }

    // --- DASHBOARD STATS ---
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalReceptionists", receptionistRepository.count());
        stats.put("todaysAppointments", appointmentRepository.countByAppointmentDate(LocalDate.now()));
        stats.put("totalRevenue", billRepository.sumTotalRevenue());
        stats.put("availableBeds", 45); // Static mock value

        // 1. Monthly Revenue
        List<Object[]> monthlyRevRaw = billRepository.getMonthlyRevenue();
        List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
        for (Object[] obj : monthlyRevRaw) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", obj[0]);
            map.put("year", obj[1]);
            map.put("amount", obj[2]);
            monthlyRevenue.add(map);
        }
        stats.put("monthlyRevenue", monthlyRevenue);

        // 2. Department Distribution
        List<Object[]> deptStatsRaw = appointmentRepository.countAppointmentsByDepartment();
        List<Map<String, Object>> deptStats = new ArrayList<>();
        for (Object[] obj : deptStatsRaw) {
            Map<String, Object> map = new HashMap<>();
            map.put("department", obj[0]);
            map.put("appointments", obj[1]);
            deptStats.add(map);
        }
        stats.put("departmentStats", deptStats);

        // 3. Appointment Status Counts
        List<Object[]> appStatusRaw = appointmentRepository.countAppointmentsByStatus();
        List<Map<String, Object>> statusStats = new ArrayList<>();
        for (Object[] obj : appStatusRaw) {
            Map<String, Object> map = new HashMap<>();
            map.put("status", obj[0]);
            map.put("count", obj[1]);
            statusStats.add(map);
        }
        stats.put("statusStats", statusStats);

        return ResponseEntity.ok(stats);
    }

    // --- DEPARTMENT CRUD ---
    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @PostMapping("/departments")
    public ResponseEntity<?> createDepartment(@RequestBody Department dept) {
        if (departmentRepository.findByName(dept.getName()).isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Department already exists!"));
        }
        Department saved = departmentRepository.save(dept);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody Department deptDetails) {
        Optional<Department> deptOpt = departmentRepository.findById(id);
        if (deptOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Department dept = deptOpt.get();
        dept.setName(deptDetails.getName());
        dept.setDescription(deptDetails.getDescription());
        return ResponseEntity.ok(departmentRepository.save(dept));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        if (!departmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        departmentRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Department deleted successfully!"));
    }

    // --- DOCTOR CRUD ---
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @PostMapping("/doctors")
    @Transactional
    public ResponseEntity<?> createDoctor(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
        }

        // Create User
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode((String) payload.get("password")));
        user.setRole(Role.DOCTOR);
        user.setActive(true);
        userRepository.save(user);

        // Create Doctor Profile
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setName((String) payload.get("name"));
        doctor.setEmail(email);
        doctor.setMobile((String) payload.get("mobile"));
        doctor.setSpecialization((String) payload.get("specialization"));
        doctor.setQualification((String) payload.get("qualification"));
        doctor.setExperience(Integer.parseInt(payload.get("experience").toString()));
        doctor.setAvailability((String) payload.get("availability"));
        doctor.setConsultationFee(Double.parseDouble(payload.get("consultationFee").toString()));
        doctor.setActive(true);

        if (payload.containsKey("departmentId") && payload.get("departmentId") != null) {
            Long deptId = Long.parseLong(payload.get("departmentId").toString());
            departmentRepository.findById(deptId).ifPresent(doctor::setDepartment);
        }

        doctorRepository.save(doctor);
        return ResponseEntity.ok(new MessageResponse("Doctor added successfully!"));
    }

    @PutMapping("/doctors/{id}")
    @Transactional
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<Doctor> docOpt = doctorRepository.findById(id);
        if (docOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Doctor doctor = docOpt.get();
        doctor.setName((String) payload.get("name"));
        doctor.setMobile((String) payload.get("mobile"));
        doctor.setSpecialization((String) payload.get("specialization"));
        doctor.setQualification((String) payload.get("qualification"));
        doctor.setExperience(Integer.parseInt(payload.get("experience").toString()));
        doctor.setAvailability((String) payload.get("availability"));
        doctor.setConsultationFee(Double.parseDouble(payload.get("consultationFee").toString()));

        if (payload.containsKey("departmentId") && payload.get("departmentId") != null) {
            Long deptId = Long.parseLong(payload.get("departmentId").toString());
            departmentRepository.findById(deptId).ifPresent(doctor::setDepartment);
        }

        // If password is provided, update it
        if (payload.containsKey("password") && payload.get("password") != null && !((String) payload.get("password")).isEmpty()) {
            User user = doctor.getUser();
            user.setPassword(passwordEncoder.encode((String) payload.get("password")));
            userRepository.save(user);
        }

        doctorRepository.save(doctor);
        return ResponseEntity.ok(new MessageResponse("Doctor details updated successfully!"));
    }

    @PatchMapping("/doctors/{id}/status")
    @Transactional
    public ResponseEntity<?> toggleDoctorStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> statusPayload) {
        Optional<Doctor> docOpt = doctorRepository.findById(id);
        if (docOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Doctor doctor = docOpt.get();
        boolean status = statusPayload.get("active");
        doctor.setActive(status);
        doctorRepository.save(doctor);

        User user = doctor.getUser();
        user.setActive(status);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Doctor active status changed to " + status));
    }

    @DeleteMapping("/doctors/{id}")
    @Transactional
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        Optional<Doctor> docOpt = doctorRepository.findById(id);
        if (docOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Doctor doctor = docOpt.get();
        User user = doctor.getUser();

        doctorRepository.delete(doctor);
        userRepository.delete(user);

        return ResponseEntity.ok(new MessageResponse("Doctor profile and user deleted successfully!"));
    }

    // --- RECEPTIONIST CRUD ---
    @GetMapping("/receptionists")
    public ResponseEntity<List<Receptionist>> getReceptionists() {
        return ResponseEntity.ok(receptionistRepository.findAll());
    }

    @PostMapping("/receptionists")
    @Transactional
    public ResponseEntity<?> createReceptionist(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
        }

        // Create User
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode((String) payload.get("password")));
        user.setRole(Role.RECEPTIONIST);
        user.setActive(true);
        userRepository.save(user);

        // Create Profile
        Receptionist receptionist = new Receptionist();
        receptionist.setUser(user);
        receptionist.setName((String) payload.get("name"));
        receptionist.setContactNumber((String) payload.get("contactNumber"));

        receptionistRepository.save(receptionist);
        return ResponseEntity.ok(new MessageResponse("Receptionist added successfully!"));
    }

    @PutMapping("/receptionists/{id}")
    @Transactional
    public ResponseEntity<?> updateReceptionist(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<Receptionist> recOpt = receptionistRepository.findById(id);
        if (recOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Receptionist receptionist = recOpt.get();
        receptionist.setName((String) payload.get("name"));
        receptionist.setContactNumber((String) payload.get("contactNumber"));

        if (payload.containsKey("password") && payload.get("password") != null && !((String) payload.get("password")).isEmpty()) {
            User user = receptionist.getUser();
            user.setPassword(passwordEncoder.encode((String) payload.get("password")));
            userRepository.save(user);
        }

        receptionistRepository.save(receptionist);
        return ResponseEntity.ok(new MessageResponse("Receptionist updated successfully!"));
    }

    @DeleteMapping("/receptionists/{id}")
    @Transactional
    public ResponseEntity<?> deleteReceptionist(@PathVariable Long id) {
        Optional<Receptionist> recOpt = receptionistRepository.findById(id);
        if (recOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Receptionist receptionist = recOpt.get();
        User user = receptionist.getUser();

        receptionistRepository.delete(receptionist);
        userRepository.delete(user);

        return ResponseEntity.ok(new MessageResponse("Receptionist deleted successfully!"));
    }

    // --- PATIENT CRUD ---
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @PostMapping("/patients")
    @Transactional
    public ResponseEntity<?> createPatient(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
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
        return ResponseEntity.ok(new MessageResponse("Patient added successfully!"));
    }

    @PutMapping("/patients/{id}")
    @Transactional
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<Patient> patOpt = patientRepository.findById(id);
        if (patOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Patient patient = patOpt.get();
        patient.setName((String) payload.get("name"));
        patient.setAge(Integer.parseInt(payload.get("age").toString()));
        patient.setGender((String) payload.get("gender"));
        patient.setBloodGroup((String) payload.get("bloodGroup"));
        patient.setAddress((String) payload.get("address"));
        patient.setContactNumber((String) payload.get("contactNumber"));
        patient.setEmergencyContact((String) payload.get("emergencyContact"));
        patient.setInsuranceDetails((String) payload.get("insuranceDetails"));
        patient.setMedicalHistory((String) payload.get("medicalHistory"));

        if (payload.containsKey("password") && payload.get("password") != null && !((String) payload.get("password")).isEmpty()) {
            User user = patient.getUser();
            user.setPassword(passwordEncoder.encode((String) payload.get("password")));
            userRepository.save(user);
        }

        patientRepository.save(patient);
        return ResponseEntity.ok(new MessageResponse("Patient updated successfully!"));
    }

    @DeleteMapping("/patients/{id}")
    @Transactional
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        Optional<Patient> patOpt = patientRepository.findById(id);
        if (patOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Patient patient = patOpt.get();
        User user = patient.getUser();

        patientRepository.delete(patient);
        userRepository.delete(user);

        return ResponseEntity.ok(new MessageResponse("Patient profile deleted successfully!"));
    }
}

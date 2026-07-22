package com.hospital.config;

import com.hospital.entity.*;
import com.hospital.model.Role;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

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
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            // 1. Seed Departments if empty
            if (departmentRepository.count() == 0) {
                List<Department> departments = Arrays.asList(
                        new Department(null, "Cardiology", "Heart health, cardiovascular diseases and diagnostics."),
                        new Department(null, "Neurology", "Brain, spinal cord and nervous system therapy."),
                        new Department(null, "Orthopedics", "Skeletal system, bone health and surgical corrections."),
                        new Department(null, "Dental", "Oral hygiene, root canals and cosmetic dental surgeries."),
                        new Department(null, "ENT", "Ear, Nose and Throat medical conditions and treatments."),
                        new Department(null, "Pediatrics", "Infant and child wellness and medical treatments."),
                        new Department(null, "General Medicine",
                                "General health checkups, primary care and treatment."),
                        new Department(null, "Gynecology", "Female reproductive health and pregnancy care."),
                        new Department(null, "Emergency", "24/7 urgent life support and critical care unit."));
                departmentRepository.saveAll(departments);
                System.out.println("Seeded default departments.");
            }

            // 2. Seed Base Users & Profiles if empty
            if (userRepository.count() == 0) {
                String defaultPassword = passwordEncoder.encode("admin123");

                // Seed Admin
                User admin = new User(null, "admin@hospital.com", defaultPassword, Role.ADMIN, true, null);
                userRepository.save(admin);
                System.out.println("Seeded Admin user: admin@hospital.com / admin123");

                // Seed Primary Doctor
                User doctorUser = new User(null, "doctor@hospital.com", defaultPassword, Role.DOCTOR, true, null);
                userRepository.save(doctorUser);

                Department cardioDept = departmentRepository.findByName("Cardiology").orElse(null);
                Doctor doctor1 = new Doctor(null, doctorUser, "Dr. Rajesh Kumar", "doctor@hospital.com", "9876543210",
                        cardioDept, "Cardiologist", "MD - Cardiology (AIIMS)", 12, "Mon-Fri 09:00-17:00", 500.00, null,
                        true);
                doctorRepository.save(doctor1);

                // Seed Secondary Doctor
                User doctorUser2 = new User(null, "doctor2@hospital.com", defaultPassword, Role.DOCTOR, true, null);
                userRepository.save(doctorUser2);
                Department neuroDept = departmentRepository.findByName("Neurology").orElse(null);
                Doctor doctor2 = new Doctor(null, doctorUser2, "Dr. Ananya Roy", "doctor2@hospital.com", "9876543211",
                        neuroDept, "Neurologist", "DM - Neurology", 10, "Mon-Fri 10:00-18:00", 750.00, null, true);
                doctorRepository.save(doctor2);

                // Seed Receptionist User
                User receptionistUser = new User(null, "receptionist@hospital.com", defaultPassword, Role.RECEPTIONIST,
                        true, null);
                userRepository.save(receptionistUser);
                Receptionist receptionist = new Receptionist(null, receptionistUser, "Sunita Sharma", "9876543212");
                receptionistRepository.save(receptionist);

                // Seed Patient 1: Rajesh Sharma
                User patientUser1 = new User(null, "patient@hospital.com", defaultPassword, Role.PATIENT, true, null);
                userRepository.save(patientUser1);
                Patient patient1 = new Patient(null, patientUser1, "Rajesh Sharma", 35, "Male", "O+",
                        "42 MG Road, Indiranagar, Bengaluru, Karnataka", "9876543213", "9876543214",
                        "Star Health Policy #12345", "Hypertension history.");
                patientRepository.save(patient1);

                // Seed Patient 2: Priya Patel
                User patientUser2 = new User(null, "patient2@hospital.com", defaultPassword, Role.PATIENT, true, null);
                userRepository.save(patientUser2);
                Patient patient2 = new Patient(null, patientUser2, "Priya Patel", 28, "Female", "A+",
                        "15 Park Street, Ahmedabad, Gujarat", "9876543215", "9876543216", "HDFC ERGO Policy #98765",
                        "No major operations on file.");
                patientRepository.save(patient2);

                // Seed Patient 3: Amitabh Verma
                User patientUser3 = new User(null, "patient3@hospital.com", defaultPassword, Role.PATIENT, true, null);
                userRepository.save(patientUser3);
                Patient patient3 = new Patient(null, patientUser3, "Amitabh Verma", 45, "Male", "B+",
                        "78 Civil Lines, Jaipur, Rajasthan", "9876543217", "9876543218", "ICICI Lombard Policy #55443",
                        "Asthma sufferer.");
                patientRepository.save(patient3);
            }

            // 3. Seed Appointments if empty
            if (appointmentRepository.count() == 0) {
                List<Doctor> doctors = doctorRepository.findAll();
                List<Patient> patients = patientRepository.findAll();
                Department cardio = departmentRepository.findByName("Cardiology").orElse(null);

                if (!doctors.isEmpty() && !patients.isEmpty()) {
                    Doctor doc1 = doctors.get(0);
                    Patient pat1 = patients.get(0); // Rajesh Sharma
                    Patient pat2 = patients.size() > 1 ? patients.get(1) : pat1; // Priya Patel
                    Patient pat3 = patients.size() > 2 ? patients.get(2) : pat1; // Amitabh Verma

                    // Appointment 1: Rajesh Sharma - APPROVED
                    Appointment app1 = new Appointment();
                    app1.setPatient(pat1);
                    app1.setDoctor(doc1);
                    app1.setDepartment(cardio);
                    app1.setAppointmentDate(LocalDate.now());
                    app1.setTimeSlot("10:00 AM");
                    app1.setReason("Routine Heart Checkup & ECG");
                    app1.setStatus("APPROVED");
                    appointmentRepository.save(app1);

                    // Appointment 2: Priya Patel - PENDING
                    Appointment app2 = new Appointment();
                    app2.setPatient(pat2);
                    app2.setDoctor(doc1);
                    app2.setDepartment(cardio);
                    app2.setAppointmentDate(LocalDate.now());
                    app2.setTimeSlot("02:30 PM");
                    app2.setReason("Chest Discomfort & Palpitations");
                    app2.setStatus("PENDING");
                    appointmentRepository.save(app2);

                    // Appointment 3: Amitabh Verma - COMPLETED
                    Appointment app3 = new Appointment();
                    app3.setPatient(pat3);
                    app3.setDoctor(doc1);
                    app3.setDepartment(cardio);
                    app3.setAppointmentDate(LocalDate.now().minusDays(1));
                    app3.setTimeSlot("11:15 AM");
                    app3.setReason("Blood Pressure Followup Consultation");
                    app3.setStatus("COMPLETED");
                    appointmentRepository.save(app3);

                    System.out.println("Seeded default appointments with Indian patient names.");
                }
            }

            // 4. Seed Medical Records if empty
            if (medicalRecordRepository.count() == 0) {
                List<Doctor> doctors = doctorRepository.findAll();
                List<Patient> patients = patientRepository.findAll();
                if (!doctors.isEmpty() && !patients.isEmpty()) {
                    Doctor doc1 = doctors.get(0);
                    Patient pat1 = patients.get(0);

                    MedicalRecord rec1 = new MedicalRecord();
                    rec1.setPatient(pat1);
                    rec1.setDoctor(doc1);
                    rec1.setDiagnosis("Stage 1 Essential Hypertension");
                    rec1.setPrescription(
                            "1. Tab Amlodipine 5mg (1-0-0) after breakfast\n2. Tab Telmisartan 40mg (0-0-1) after dinner");
                    rec1.setSymptoms("Occasional morning headaches, blood pressure reading 142/92 mmHg");
                    rec1.setDoctorNotes(
                            "Patient advised to restrict dietary sodium < 2g/day and engage in 30 mins moderate cardio daily. Recheck BP in 14 days.");
                    medicalRecordRepository.save(rec1);

                    System.out.println("Seeded default medical records.");
                }
            }

            // 5. Seed Bills if empty
            if (billRepository.count() == 0) {
                List<Patient> patients = patientRepository.findAll();
                if (!patients.isEmpty()) {
                    Patient pat1 = patients.get(0);

                    Bill bill1 = new Bill();
                    bill1.setPatient(pat1);
                    bill1.setConsultationCharges(500.0);
                    bill1.setMedicineCharges(150.0);
                    bill1.setLaboratoryCharges(200.0);
                    bill1.setRoomCharges(0.0);
                    bill1.setAdditionalCharges(0.0);
                    bill1.setDiscount(50.0);
                    double subtotal = 500 + 150 + 200 - 50;
                    double gst = subtotal * 0.18;
                    bill1.setGst(gst);
                    bill1.setTotalAmount(subtotal + gst);
                    bill1.setStatus("PAID");
                    billRepository.save(bill1);

                    Bill bill2 = new Bill();
                    bill2.setPatient(pat1);
                    bill2.setConsultationCharges(500.0);
                    bill2.setMedicineCharges(300.0);
                    bill2.setLaboratoryCharges(0.0);
                    bill2.setRoomCharges(0.0);
                    bill2.setAdditionalCharges(0.0);
                    bill2.setDiscount(0.0);
                    double subtotal2 = 500 + 300;
                    double gst2 = subtotal2 * 0.18;
                    bill2.setGst(gst2);
                    bill2.setTotalAmount(subtotal2 + gst2);
                    bill2.setStatus("PENDING");
                    billRepository.save(bill2);

                    System.out.println("Seeded default bills.");
                }
            }

        } catch (Exception e) {
            System.err.println("Seeder completed with notice: " + e.getMessage());
        }
    }
}

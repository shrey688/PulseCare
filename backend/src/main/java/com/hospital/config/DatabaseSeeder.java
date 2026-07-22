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
                        new Department(null, "General Medicine", "General health checkups, primary care and treatment."),
                        new Department(null, "Gynecology", "Female reproductive health and pregnancy care."),
                        new Department(null, "Emergency", "24/7 urgent life support and critical care unit.")
                );
                departmentRepository.saveAll(departments);
            }

            String defaultPassword = passwordEncoder.encode("admin123");

            // 2. Ensure Admin User
            if (userRepository.findByEmail("admin@hospital.com").isEmpty()) {
                User admin = new User(null, "admin@hospital.com", defaultPassword, Role.ADMIN, true, null);
                userRepository.save(admin);
            }

            // 3. Ensure Doctor Users
            if (userRepository.findByEmail("doctor@hospital.com").isEmpty()) {
                User doctorUser = new User(null, "doctor@hospital.com", defaultPassword, Role.DOCTOR, true, null);
                userRepository.save(doctorUser);
                Department cardioDept = departmentRepository.findByName("Cardiology").orElse(null);
                Doctor doctor1 = new Doctor(null, doctorUser, "Dr. Rajesh Kumar", "doctor@hospital.com", "9876543210", 
                        cardioDept, "Cardiologist", "MD - Cardiology (AIIMS)", 12, "Mon-Fri 09:00-17:00", 500.00, null, true);
                doctorRepository.save(doctor1);
            }

            if (userRepository.findByEmail("doctor2@hospital.com").isEmpty()) {
                User doctorUser2 = new User(null, "doctor2@hospital.com", defaultPassword, Role.DOCTOR, true, null);
                userRepository.save(doctorUser2);
                Department neuroDept = departmentRepository.findByName("Neurology").orElse(null);
                Doctor doctor2 = new Doctor(null, doctorUser2, "Dr. Ananya Roy", "doctor2@hospital.com", "9876543211", 
                        neuroDept, "Neurologist", "DM - Neurology", 10, "Mon-Fri 10:00-18:00", 750.00, null, true);
                doctorRepository.save(doctor2);
            }

            // 4. Ensure Receptionist User
            if (userRepository.findByEmail("receptionist@hospital.com").isEmpty()) {
                User receptionistUser = new User(null, "receptionist@hospital.com", defaultPassword, Role.RECEPTIONIST, true, null);
                userRepository.save(receptionistUser);
                Receptionist receptionist = new Receptionist(null, receptionistUser, "Sunita Sharma", "9876543212");
                receptionistRepository.save(receptionist);
            }

            // 5. Ensure Patients
            if (userRepository.findByEmail("patient@hospital.com").isEmpty()) {
                User patientUser1 = new User(null, "patient@hospital.com", defaultPassword, Role.PATIENT, true, null);
                userRepository.save(patientUser1);
                Patient patient1 = new Patient(null, patientUser1, "Rajesh Sharma", 35, "Male", "O+", 
                        "42 MG Road, Indiranagar, Bengaluru, Karnataka", "9876543213", "9876543214", "Star Health Policy #12345", "Hypertension history.");
                patientRepository.save(patient1);
            }

            if (userRepository.findByEmail("patient2@hospital.com").isEmpty()) {
                User patientUser2 = new User(null, "patient2@hospital.com", defaultPassword, Role.PATIENT, true, null);
                userRepository.save(patientUser2);
                Patient patient2 = new Patient(null, patientUser2, "Priya Patel", 28, "Female", "A+", 
                        "15 Park Street, Ahmedabad, Gujarat", "9876543215", "9876543216", "HDFC ERGO Policy #98765", "No major operations on file.");
                patientRepository.save(patient2);
            }

            if (userRepository.findByEmail("patient3@hospital.com").isEmpty()) {
                User patientUser3 = new User(null, "patient3@hospital.com", defaultPassword, Role.PATIENT, true, null);
                userRepository.save(patientUser3);
                Patient patient3 = new Patient(null, patientUser3, "Amitabh Verma", 45, "Male", "B+", 
                        "78 Civil Lines, Jaipur, Rajasthan", "9876543217", "9876543218", "ICICI Lombard Policy #55443", "Asthma sufferer.");
                patientRepository.save(patient3);
            }

            if (userRepository.findByEmail("patient4@hospital.com").isEmpty()) {
                User patientUser4 = new User(null, "patient4@hospital.com", defaultPassword, Role.PATIENT, true, null);
                userRepository.save(patientUser4);
                Patient patient4 = new Patient(null, patientUser4, "Ananya Iyer", 32, "Female", "AB+", 
                        "109 South Extension, New Delhi", "9876543219", "9876543220", "Max Bupa Policy #78787", "Seasonal allergies.");
                patientRepository.save(patient4);
            }

            // 6. Seed Appointments if empty
            if (appointmentRepository.count() == 0) {
                List<Doctor> doctors = doctorRepository.findAll();
                List<Patient> patients = patientRepository.findAll();
                Department cardio = departmentRepository.findByName("Cardiology").orElse(null);

                if (!doctors.isEmpty() && !patients.isEmpty()) {
                    Doctor doc1 = doctors.get(0);
                    Patient pat1 = patients.get(0);
                    Patient pat2 = patients.size() > 1 ? patients.get(1) : pat1;
                    Patient pat3 = patients.size() > 2 ? patients.get(2) : pat1;
                    Patient pat4 = patients.size() > 3 ? patients.get(3) : pat1;

                    Appointment app1 = new Appointment();
                    app1.setPatient(pat1);
                    app1.setDoctor(doc1);
                    app1.setDepartment(cardio);
                    app1.setAppointmentDate(LocalDate.now());
                    app1.setTimeSlot("10:00 AM");
                    app1.setReason("Routine Heart Checkup & ECG");
                    app1.setStatus("APPROVED");
                    appointmentRepository.save(app1);

                    Appointment app2 = new Appointment();
                    app2.setPatient(pat2);
                    app2.setDoctor(doc1);
                    app2.setDepartment(cardio);
                    app2.setAppointmentDate(LocalDate.now());
                    app2.setTimeSlot("02:30 PM");
                    app2.setReason("Chest Discomfort & Palpitations");
                    app2.setStatus("PENDING");
                    appointmentRepository.save(app2);

                    Appointment app3 = new Appointment();
                    app3.setPatient(pat3);
                    app3.setDoctor(doc1);
                    app3.setDepartment(cardio);
                    app3.setAppointmentDate(LocalDate.now().minusDays(1));
                    app3.setTimeSlot("11:15 AM");
                    app3.setReason("Blood Pressure Followup Consultation");
                    app3.setStatus("COMPLETED");
                    appointmentRepository.save(app3);

                    Appointment app4 = new Appointment();
                    app4.setPatient(pat4);
                    app4.setDoctor(doc1);
                    app4.setDepartment(cardio);
                    app4.setAppointmentDate(LocalDate.now());
                    app4.setTimeSlot("04:00 PM");
                    app4.setReason("ECG Report Evaluation");
                    app4.setStatus("APPROVED");
                    appointmentRepository.save(app4);
                }
            }

            // 7. Seed Medical Records for each patient if they don't have records
            List<Doctor> doctorsList = doctorRepository.findAll();
            if (!doctorsList.isEmpty()) {
                Doctor doc1 = doctorsList.get(0);
                
                patientRepository.findAll().forEach(pat -> {
                    if (medicalRecordRepository.findByPatientId(pat.getId()).isEmpty()) {
                        MedicalRecord record = new MedicalRecord();
                        record.setPatient(pat);
                        record.setDoctor(doc1);
                        
                        if (pat.getName().contains("Rajesh")) {
                            record.setDiagnosis("Stage 1 Essential Hypertension");
                            record.setPrescription("1. Tab Amlodipine 5mg (1-0-0) after breakfast\n2. Tab Telmisartan 40mg (0-0-1) after dinner");
                            record.setSymptoms("Occasional morning headaches, elevated blood pressure (142/92 mmHg)");
                            record.setDoctorNotes("Dietary sodium restriction advised. Review BP in 14 days.");
                        } else if (pat.getName().contains("Priya")) {
                            record.setDiagnosis("Common Migraine");
                            record.setPrescription("1. Tab Sumatriptan 50mg (on-onset) for acute headache relief\n2. Tab Propranolol 40mg (1-0-1) as prophylaxis");
                            record.setSymptoms("Throbbing unilateral headache, nausea, photophobia");
                            record.setDoctorNotes("Advised keeping a migraine symptom diary. Limit caffeine consumption.");
                        } else if (pat.getName().contains("Amitabh")) {
                            record.setDiagnosis("Moderate Allergic Asthma");
                            record.setPrescription("1. Budesonide / Formoterol Inhaler (160mcg/4.5mcg) - 2 puffs twice daily\n2. Tab Montelukast 10mg (0-0-1) at night");
                            record.setSymptoms("Exertional dyspnea, dry nocturnal cough, wheezing");
                            record.setDoctorNotes("Use inhaler correctly; spacer advised. Keep rescue inhaler close.");
                        } else if (pat.getName().contains("Ananya")) {
                            record.setDiagnosis("Allergic Rhinitis");
                            record.setPrescription("1. Tab Cetirizine 10mg (0-0-1) before bedtime\n2. Fluticasone Furoate nasal spray (1 spray/nostril once daily)");
                            record.setSymptoms("Paroxysmal sneezing, clear rhinorrhea, itchy eyes");
                            record.setDoctorNotes("Avoid exposure to pollen and dust. Clean AC filters regularly.");
                        } else {
                            record.setDiagnosis("General Medical Consultation");
                            record.setPrescription("1. Cap Multivitamin (1-0-0) after breakfast");
                            record.setSymptoms("Mild fatigue");
                            record.setDoctorNotes("Stay hydrated, regular sleep cycles.");
                        }
                        medicalRecordRepository.save(record);
                    }
                });
            }

            // 8. Seed Bills if empty
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
                }
            }

            System.out.println("DatabaseSeeder execution finished successfully. All default roles and clinical histories verified.");

        } catch (Exception e) {
            System.err.println("Seeder completed with notice: " + e.getMessage());
        }
    }
}

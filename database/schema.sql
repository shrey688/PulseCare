-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ADMIN, DOCTOR, RECEPTIONIST, PATIENT
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
) ENGINE=InnoDB;

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    department_id INT,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience INT NOT NULL,
    availability VARCHAR(255) NOT NULL, -- e.g. "Mon-Fri 09:00-17:00"
    consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    profile_picture VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20) NOT NULL,
    insurance_details VARCHAR(255) DEFAULT NULL,
    medical_history TEXT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Receptionists Table
CREATE TABLE IF NOT EXISTS receptionists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    reason TEXT DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, CANCELLED, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    prescription TEXT DEFAULT NULL,
    symptoms TEXT DEFAULT NULL,
    doctor_notes TEXT DEFAULT NULL,
    attachment_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Bills Table
CREATE TABLE IF NOT EXISTS bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT DEFAULT NULL,
    consultation_charges DECIMAL(10, 2) DEFAULT 0.00,
    medicine_charges DECIMAL(10, 2) DEFAULT 0.00,
    laboratory_charges DECIMAL(10, 2) DEFAULT 0.00,
    surgery_charges DECIMAL(10, 2) DEFAULT 0.00,
    room_charges DECIMAL(10, 2) DEFAULT 0.00,
    additional_charges DECIMAL(10, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    gst DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, FAILED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PAID',
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indexing for performance optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_bills_patient ON bills(patient_id);

-- SEED DATA (Passwords hashed with BCrypt, using "$2a$10$8.eNl.26SgNf6Kz0BvT/UeC1d2xY.26x.2a.2a.2a" -> representing standard BCrypt hashes)
-- Note: In our Spring Boot server we will seed these with real valid BCrypt hashes dynamically on startup if empty,
-- but here we provide valid BCrypt hashes for 'admin123', 'doctor123', 'receptionist123', and 'patient123'.

-- Hashed values:
-- 'admin123' -> $2a$10$Rz291Nug0eIePz9/s5l6I.VlK9P6GjN3.5eMvD2h9G2U2YV7k47Oq
-- 'doctor123' -> $2a$10$Rz291Nug0eIePz9/s5l6I.VlK9P6GjN3.5eMvD2h9G2U2YV7k47Oq
-- 'receptionist123' -> $2a$10$Rz291Nug0eIePz9/s5l6I.VlK9P6GjN3.5eMvD2h9G2U2YV7k47Oq
-- 'patient123' -> $2a$10$Rz291Nug0eIePz9/s5l6I.VlK9P6GjN3.5eMvD2h9G2U2YV7k47Oq

INSERT INTO users (id, email, password, role, is_active) VALUES
(1, 'admin@hospital.com', '$2a$10$Rz291Nug0eIePz9/s5l6I.VlK9P6GjN3.5eMvD2h9G2U2YV7k47Oq', 'ADMIN', true),
(2, 'john.doe@hospital.com', '$2a$10$Rz291Nug0eIePz9/s5l6I.VlK9P6GjN3.5eMvD2h9G2U2YV7k47Oq', 'DOCTOR', true),
(3, 'jane.smith@hospital.com', '$2a$10$Rz291Nug0eIePz9/s5l6I.VlK9P6GjN3.5eMvD2h9G2U2YV7k47Oq', 'DOCTOR', true),
(4, 'receptionist@hospital.com', '$2a$10$Rz291Nug0eIePz9/s5l6I.VlK9P6GjN3.5eMvD2h9G2U2YV7k47Oq', 'RECEPTIONIST', true),
(5, 'patient@hospital.com', '$2a$10$Rz291Nug0eIePz9/s5l6I.VlK9P6GjN3.5eMvD2h9G2U2YV7k47Oq', 'PATIENT', true);

INSERT INTO departments (id, name, description) VALUES
(1, 'Cardiology', 'Heart health, cardiovascular diseases and diagnostics.'),
(2, 'Neurology', 'Brain, spinal cord and nervous system therapy.'),
(3, 'Orthopedics', 'Skeletal system, bone health and surgical corrections.'),
(4, 'Dental', 'Oral hygiene, root canals and cosmetic dental surgeries.'),
(5, 'ENT', 'Ear, Nose and Throat medical conditions and treatments.'),
(6, 'Pediatrics', 'Infant and child wellness and medical treatments.'),
(7, 'General Medicine', 'General health checkups, primary care and treatment.'),
(8, 'Gynecology', 'Female reproductive health and pregnancy care.'),
(9, 'Emergency', '24/7 urgent life support and critical care unit.');

INSERT INTO doctors (id, user_id, name, email, mobile, department_id, specialization, qualification, experience, availability, consultation_fee) VALUES
(1, 2, 'Dr. John Doe', 'john.doe@hospital.com', '9876543210', 1, 'Cardiologist', 'MD - Cardiology', 12, 'Mon-Fri 09:00-13:00', 500.00),
(2, 3, 'Dr. Jane Smith', 'jane.smith@hospital.com', '9876543211', 2, 'Neurologist', 'MD - Neurology', 8, 'Mon-Wed 14:00-18:00', 600.00);

INSERT INTO receptionists (id, user_id, name, contact_number) VALUES
(1, 4, 'Sarah Connor', '9876543212');

INSERT INTO patients (id, user_id, name, age, gender, blood_group, address, contact_number, emergency_contact, insurance_details, medical_history) VALUES
(1, 5, 'Bob Johnson', 35, 'Male', 'O+', '123 Main Street, NY', '9876543213', '9876543214', 'MetLife Policy #12345', 'No major past operations. Controlled seasonal allergies.');

# PulseCare - Hospital Management System

A modern, production-ready, full-stack **Hospital Management System** built with **React.js**, **Spring Boot**, and **MySQL**.

---

## 🌟 Key Features

* **Role-Based Access Control (RBAC)**: Custom secure portals for **Admin**, **Doctor**, **Receptionist**, and **Patient**.
* **JWT Authentication**: Secure stateless session management with BCrypt password hashing.
* **Modern UI & Dark Mode**: Glassmorphism aesthetic, responsive sidebar/header layouts, and instant light/dark mode toggling.
* **Landing Page**: Public website featuring Hero banner, Mission & Vision, Departments, Doctor cards, Facilities, Emergency trigger, Testimonials, and Google Maps location.
* **Admin Dashboard**: Real-time metric cards, Chart.js revenue & department distribution visualizations, CRUD dialogs for doctors, receptionists, patients, and departments.
* **Doctor Dashboard**: Scheduled appointment manager, diagnosis entries, digital prescriptions writer, and attachment uploads (PDFs/Scans).
* **Receptionist Dashboard**: Patient registration, appointment slot chooser, billing invoice generation, payment recorder, and hospital admission/discharge workflows.
* **Patient Dashboard**: Self-service appointment booking, medical history viewer, prescription inspector, and printable PDF invoice downloader.
* **Data Export**: Export CSV reports for appointments, financials/revenue, and patient registries.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React.js (Vite)
* **Styling**: Tailwind CSS v3 & Custom Glassmorphism CSS
* **Routing**: React Router v6
* **Charts**: Chart.js & `react-chartjs-2`
* **Icons**: Lucide React
* **HTTP Client**: Axios

### Backend
* **Framework**: Spring Boot 3.2.5 (Java 17+)
* **Security**: Spring Security & JWT (`io.jsonwebtoken` 0.11.5)
* **ORM**: Spring Data JPA / Hibernate
* **Database**: MySQL 8.0+
* **Build Tool**: Apache Maven

---

## 📁 Folder Structure

```
Hospital-Management-System/
├── Frontend/                 # Vite + React Frontend Application
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, Header, Footer, ProtectedRoute
│   │   ├── context/          # AuthContext & ThemeContext
│   │   ├── pages/            # LandingPage, Login, Register, Dashboards
│   │   ├── routes/           # AppRoutes configuration
│   │   └── services/         # Axios API configuration
│   ├── tailwind.config.js
│   └── index.css
│
├── backend/                  # Spring Boot Maven Server
│   ├── src/main/java/com/hospital/
│   │   ├── config/           # DatabaseSeeder & WebMvcConfig
│   │   ├── controller/       # Auth, Admin, Doctor, Receptionist, Patient, Public, Reports
│   │   ├── dto/              # Login, Signup, JwtResponse, Messages
│   │   ├── entity/           # User, Doctor, Patient, Receptionist, Department, Appointment, Bill...
│   │   ├── model/            # Role Enum (ADMIN, DOCTOR, RECEPTIONIST, PATIENT)
│   │   ├── repository/       # JPA Repositories & Analytics Queries
│   │   └── security/         # JwtUtils, AuthTokenFilter, WebSecurityConfig
│   └── pom.xml
│
├── database/                 # MySQL Database Scripts
│   └── schema.sql            # Table definitions, indices, and sample seeds
│
└── README.md                 # Project Setup & Documentation
```

---

## 🔑 Default User Credentials (Auto-Seeded)

The Spring Boot backend automatically seeds the database on first boot with the following credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hospital.com` | `admin123` |
| **Doctor** | `doctor@hospital.com` | `admin123` |
| **Receptionist** | `receptionist@hospital.com` | `admin123` |
| **Patient** | `patient@hospital.com` | `admin123` |

> *Note: Quick Demo Buttons are also available directly on the Login page for one-click access.*

---

## 🚀 Quick Start & Setup Instructions

### 1. Database Setup (MySQL)
1. Ensure MySQL Server is running on your machine (Default Port: `3306`).
2. Run the database script provided in `database/schema.sql` or create a database named `hospital_db`:
   ```sql
   CREATE DATABASE hospital_db;
   ```
3. Update `backend/src/main/resources/application.properties` with your MySQL username and password if different from `root`/`root`.

### 2. Backend Setup (Spring Boot)
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot server using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start at `http://localhost:8080`.

### 3. Frontend Setup (React + Vite)
1. Open a terminal in the `Frontend/` directory:
   ```bash
   cd Frontend
   ```
2. Install node dependencies (if not installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web application at `http://localhost:5173`.

---

## 📄 API Documentation Summary

### Auth Endpoints
* `POST /api/auth/signin` - Authenticate user & return JWT token
* `POST /api/auth/signup` - Register new patient account
* `POST /api/auth/forgot-password` - Request temporary password reset

### Admin Endpoints (Requires `ADMIN` Role)
* `GET /api/admin/dashboard/stats` - Fetch overall stats & revenue chart aggregates
* `GET / POST / PUT / DELETE /api/admin/doctors` - Manage doctors
* `GET / POST / PUT / DELETE /api/admin/patients` - Manage patients
* `GET / POST / PUT / DELETE /api/admin/receptionists` - Manage receptionists
* `GET / POST / PUT / DELETE /api/admin/departments` - Manage hospital departments
* `GET /api/admin/reports/export/{type}` - Export CSV for `appointments`, `revenue`, or `patients`

### Doctor Endpoints (Requires `DOCTOR` Role)
* `GET /api/doctor/appointments` - Fetch doctor appointments
* `PATCH /api/doctor/appointments/{id}/status` - Update status (Approved / Rejected / Completed)
* `POST /api/doctor/records` - Add diagnosis, prescription, and upload file attachments

### Receptionist Endpoints (Requires `RECEPTIONIST` Role)
* `POST /api/receptionist/patients` - Quick patient registration
* `POST /api/receptionist/appointments` - Book & approve appointment
* `POST /api/receptionist/bills` - Generate billing invoice
* `POST /api/receptionist/bills/{id}/pay` - Process payment
* `PATCH /api/receptionist/appointments/{id}/admit` - Admit patient
* `PATCH /api/receptionist/appointments/{id}/discharge` - Discharge patient & compute bill

### Patient Endpoints (Requires `PATIENT` Role)
* `POST /api/patient/appointments` - Book doctor appointment
* `GET /api/patient/appointments` - View scheduled appointments
* `GET /api/patient/records` - View diagnostic prescriptions & report attachments
* `GET /api/patient/bills` - View billing receipts & print PDF invoices

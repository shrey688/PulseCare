# PulseCare Hospital Management System

PulseCare is a full-stack hospital management web application designed for patients, doctors, receptionists, and administrators to manage appointments, billing, prescriptions, admissions, and reports.

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Chart.js, React Router
- **Backend**: Spring Boot, Spring Security, Hibernate (JPA)
- **Database**: MySQL

## Directory Layout

```text
├── Frontend/                 # React frontend application
├── backend/                  # Spring Boot backend server
├── database/                 # MySQL database SQL schema scripts
└── README.md
```

## Running the Application

### 1. Database Configuration
1. Make sure your MySQL Server is running (default port `3306`).
2. Create the database:
   ```sql
   CREATE DATABASE hospital_db;
   ```
3. Import the initial database schema from `database/schema.sql`.
4. If your MySQL credentials are not `root` with password `2005`, update the connection details in `backend/src/main/resources/application.properties`.

### 2. Run Backend (Spring Boot)
1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   ```
2. Build and run using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The server will run at `http://localhost:8080`.

### 3. Run Frontend (Vite + React)
1. Open a terminal in the `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
3. The application will run at `http://localhost:5173`.

## Default Login Credentials

On startup, the seeder automatically populates the database with the following credentials (all passwords are `admin123`):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hospital.com` | `admin123` |
| **Doctor** | `doctor@hospital.com` | `admin123` |
| **Receptionist** | `receptionist@hospital.com` | `admin123` |
| **Patient** | `patient@hospital.com` | `admin123` |

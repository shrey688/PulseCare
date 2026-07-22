package com.hospital.controller;

import com.hospital.entity.*;
import com.hospital.repository.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping("/summary")
    public ResponseEntity<?> getReportsSummary() {
        Map<String, Object> report = new HashMap<>();

        long totalApps = appointmentRepository.count();
        long completedApps = appointmentRepository.countAppointmentsByStatus().stream()
                .filter(arr -> "COMPLETED".equalsIgnoreCase(arr[0].toString()))
                .mapToLong(arr -> (long) arr[1])
                .findFirst()
                .orElse(0L);

        double totalRevenue = billRepository.sumTotalRevenue();
        double monthlyRevenue = billRepository.sumRevenueSince(LocalDateTime.now().minusDays(30));

        report.put("totalAppointments", totalApps);
        report.put("completedAppointments", completedApps);
        report.put("totalRevenue", totalRevenue);
        report.put("last30DaysRevenue", monthlyRevenue);
        report.put("generatedAt", LocalDateTime.now());

        return ResponseEntity.ok(report);
    }

    @GetMapping("/export/appointments")
    public void exportAppointments(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"appointments_report.csv\"");

        List<Appointment> list = appointmentRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Patient Name,Doctor Name,Department,Date,Time Slot,Status,Reason\n");

        for (Appointment app : list) {
            csv.append(app.getId()).append(",")
               .append(escapeCsv(app.getPatient().getName())).append(",")
               .append(escapeCsv(app.getDoctor().getName())).append(",")
               .append(escapeCsv(app.getDepartment().getName())).append(",")
               .append(app.getAppointmentDate()).append(",")
               .append(escapeCsv(app.getTimeSlot())).append(",")
               .append(app.getStatus()).append(",")
               .append(escapeCsv(app.getReason())).append("\n");
        }

        response.getWriter().write(csv.toString());
    }

    @GetMapping("/export/revenue")
    public void exportRevenue(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"revenue_report.csv\"");

        List<Bill> list = billRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("Bill ID,Patient Name,Date,Consultation,Medicine,Lab,Surgery,Room,Discount,GST,Total,Status\n");

        for (Bill b : list) {
            csv.append(b.getId()).append(",")
               .append(escapeCsv(b.getPatient().getName())).append(",")
               .append(b.getCreatedAt()).append(",")
               .append(b.getConsultationCharges()).append(",")
               .append(b.getMedicineCharges()).append(",")
               .append(b.getLaboratoryCharges()).append(",")
               .append(b.getSurgeryCharges()).append(",")
               .append(b.getRoomCharges()).append(",")
               .append(b.getDiscount()).append(",")
               .append(b.getGst()).append(",")
               .append(b.getTotalAmount()).append(",")
               .append(b.getStatus()).append("\n");
        }

        response.getWriter().write(csv.toString());
    }

    @GetMapping("/export/patients")
    public void exportPatients(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"patients_report.csv\"");

        List<Patient> list = patientRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("Patient ID,Name,Age,Gender,Blood Group,Contact Number,Emergency Contact,Insurance,Address\n");

        for (Patient p : list) {
            csv.append(p.getId()).append(",")
               .append(escapeCsv(p.getName())).append(",")
               .append(p.getAge()).append(",")
               .append(p.getGender()).append(",")
               .append(p.getBloodGroup()).append(",")
               .append(escapeCsv(p.getContactNumber())).append(",")
               .append(escapeCsv(p.getEmergencyContact())).append(",")
               .append(escapeCsv(p.getInsuranceDetails())).append(",")
               .append(escapeCsv(p.getAddress())).append("\n");
        }

        response.getWriter().write(csv.toString());
    }

    private String escapeCsv(String input) {
        if (input == null) {
            return "";
        }
        String output = input.replace("\"", "\"\"");
        if (output.contains(",") || output.contains("\n") || output.contains("\"")) {
            return "\"" + output + "\"";
        }
        return output;
    }
}

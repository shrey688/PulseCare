package com.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "consultation_charges")
    private Double consultationCharges = 0.00;

    @Column(name = "medicine_charges")
    private Double medicineCharges = 0.00;

    @Column(name = "laboratory_charges")
    private Double laboratoryCharges = 0.00;

    @Column(name = "surgery_charges")
    private Double surgeryCharges = 0.00;

    @Column(name = "room_charges")
    private Double roomCharges = 0.00;

    @Column(name = "additional_charges")
    private Double additionalCharges = 0.00;

    @Column(name = "discount")
    private Double discount = 0.00;

    @Column(name = "gst")
    private Double gst = 0.00;

    @Column(name = "total_amount")
    private Double totalAmount = 0.00;

    @Column(nullable = false, length = 50)
    private String status = "PENDING"; // PENDING, PAID, FAILED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

package com.hospital.repository;

import com.hospital.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByPatientId(Long patientId);
    List<Bill> findByAppointmentId(Long appointmentId);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0.0) FROM Bill b WHERE b.status = 'PAID'")
    Double sumTotalRevenue();

    @Query("SELECT MONTH(b.createdAt), YEAR(b.createdAt), COALESCE(SUM(b.totalAmount), 0.0) FROM Bill b WHERE b.status = 'PAID' GROUP BY YEAR(b.createdAt), MONTH(b.createdAt) ORDER BY YEAR(b.createdAt) ASC, MONTH(b.createdAt) ASC")
    List<Object[]> getMonthlyRevenue();

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0.0) FROM Bill b WHERE b.status = 'PAID' AND b.createdAt >= :startDate")
    Double sumRevenueSince(@Param("startDate") LocalDateTime startDate);
}

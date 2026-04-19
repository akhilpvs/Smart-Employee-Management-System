package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

/**
 * Attendance Repository - Database operations for Attendance entity
 */
@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    
    // Find attendance records for specific employee
    List<Attendance> findByEmployeeId(Integer employeeId);
    
    // Find attendance records for date range
    List<Attendance> findByEmployeeIdAndAttendanceDateBetween(Integer employeeId, LocalDate startDate, LocalDate endDate);
    
    // Find today's attendance for employee
    Attendance findByEmployeeIdAndAttendanceDate(Integer employeeId, LocalDate attendanceDate);
}

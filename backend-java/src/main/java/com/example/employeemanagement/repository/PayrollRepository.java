package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Payroll Repository - Database operations for Payroll entity
 */
@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Integer> {
    
    // Find payroll for specific employee and month
    Optional<Payroll> findByEmployeeIdAndMonthAndYear(Integer employeeId, Integer month, Integer year);
    
    // Find all payroll for an employee
    List<Payroll> findByEmployeeId(Integer employeeId);
    
    // Find payroll by month and year
    List<Payroll> findByMonthAndYear(Integer month, Integer year);
}

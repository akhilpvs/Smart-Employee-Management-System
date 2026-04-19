package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Leave Repository - Database operations for Leave entity
 */
@Repository
public interface LeaveRepository extends JpaRepository<Leave, Integer> {
    
    // Find all leaves for an employee
    List<Leave> findByEmployeeId(Integer employeeId);
    
    // Find leaves by status
    List<Leave> findByEmployeeIdAndStatus(Integer employeeId, String status);
    
    // Find pending leaves
    List<Leave> findByStatus(String status);
}

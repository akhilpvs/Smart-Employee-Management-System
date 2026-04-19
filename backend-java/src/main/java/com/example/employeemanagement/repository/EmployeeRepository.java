package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Employee entity.
 * Provides CRUD operations for Employee entities.
 */
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
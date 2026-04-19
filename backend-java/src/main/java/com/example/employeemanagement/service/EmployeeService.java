package com.example.employeemanagement.service;

import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Service class for handling employee business logic.
 * Provides methods to manage employee data.
 */
@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Retrieves all employees.
     * @return List of all employees
     */
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    /**
     * Retrieves an employee by ID.
     * @param id The ID of the employee
     * @return Optional containing the employee if found
     */
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    /**
     * Saves an employee (creates or updates).
     * @param employee The employee to save
     * @return The saved employee
     */
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    /**
     * Deletes an employee by ID.
     * @param id The ID of the employee to delete
     */
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
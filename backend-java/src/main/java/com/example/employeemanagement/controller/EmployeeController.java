package com.example.employeemanagement.controller;

import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for employee endpoints.
 * Handles HTTP requests related to employee management.
 */
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    /**
     * Retrieves all employees.
     * @return List of all employees
     */
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    /**
     * Retrieves an employee by ID.
     * @param id The ID of the employee
     * @return ResponseEntity with the employee or not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        if (employee.isPresent()) {
            return ResponseEntity.ok(employee.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Creates a new employee.
     * @param employee The employee data from request body
     * @return The created employee
     */
    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.saveEmployee(employee);
    }

    /**
     * Updates an existing employee.
     * @param id The ID of the employee to update
     * @param employeeDetails The updated employee data
     * @return ResponseEntity with the updated employee or not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        if (employee.isPresent()) {
            Employee emp = employee.get();
            emp.setName(employeeDetails.getName());
            emp.setEmail(employeeDetails.getEmail());
            emp.setPhone(employeeDetails.getPhone());
            emp.setDepartment(employeeDetails.getDepartment());
            emp.setPosition(employeeDetails.getPosition());
            emp.setSalary(employeeDetails.getSalary());
            emp.setHireDate(employeeDetails.getHireDate());
            return ResponseEntity.ok(employeeService.saveEmployee(emp));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes an employee by ID.
     * @param id The ID of the employee to delete
     * @return ResponseEntity indicating success or not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        if (employeeService.getEmployeeById(id).isPresent()) {
            employeeService.deleteEmployee(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
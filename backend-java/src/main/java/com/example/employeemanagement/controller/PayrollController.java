package com.example.employeemanagement.controller;

import com.example.employeemanagement.entity.Payroll;
import com.example.employeemanagement.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

/**
 * Payroll Controller - REST endpoints for payroll operations
 */
@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    // Generate payslip
    @GetMapping("/generate/{employeeId}/{month}/{year}")
    public ResponseEntity<?> generatePayslip(@PathVariable Integer employeeId, 
                                            @PathVariable Integer month, 
                                            @PathVariable Integer year) {
        try {
            Optional<Payroll> payroll = payrollService.getPayslip(employeeId, month, year);
            if (payroll.isPresent()) {
                return ResponseEntity.ok().body(new ApiResponse(true, "Payslip generated", payroll.get()));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Payroll not found", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error generating payslip", null));
        }
    }

    // Get employee payroll
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getEmployeePayroll(@PathVariable Integer employeeId) {
        try {
            List<Payroll> payrolls = payrollService.getEmployeePayroll(employeeId);
            return ResponseEntity.ok().body(new ApiResponse(true, "Employee payroll fetched", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error fetching payroll", null));
        }
    }

    // Get monthly payroll
    @GetMapping("/monthly/{month}/{year}")
    public ResponseEntity<?> getMonthlyPayroll(@PathVariable Integer month, 
                                              @PathVariable Integer year) {
        try {
            List<Payroll> payrolls = payrollService.getMonthlyPayroll(month, year);
            return ResponseEntity.ok().body(new ApiResponse(true, "Monthly payroll fetched", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error fetching monthly payroll", null));
        }
    }

    // Create payroll
    @PostMapping
    public ResponseEntity<?> createPayroll(@RequestBody Payroll payroll) {
        try {
            Payroll newPayroll = payrollService.createPayroll(payroll);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Payroll created successfully", newPayroll));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error creating payroll", null));
        }
    }

    // Update payroll
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayroll(@PathVariable Integer id, @RequestBody Payroll payrollDetails) {
        try {
            Payroll updatedPayroll = payrollService.updatePayroll(id, payrollDetails);
            if (updatedPayroll != null) {
                return ResponseEntity.ok().body(new ApiResponse(true, "Payroll updated successfully", updatedPayroll));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Payroll not found", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating payroll", null));
        }
    }

    // Delete payroll
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayroll(@PathVariable Integer id) {
        try {
            boolean deleted = payrollService.deletePayroll(id);
            if (deleted) {
                return ResponseEntity.ok().body(new ApiResponse(true, "Payroll deleted successfully", null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Payroll not found", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting payroll", null));
        }
    }

    // Get total salary expense
    @GetMapping("/total-expense/{month}/{year}")
    public ResponseEntity<?> getTotalSalaryExpense(@PathVariable Integer month, 
                                                  @PathVariable Integer year) {
        try {
            Double total = payrollService.getTotalSalaryExpense(month, year);
            return ResponseEntity.ok().body(new ApiResponse(true, "Total salary expense", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error calculating total expense", null));
        }
    }

    // Simple API Response wrapper
    public static class ApiResponse {
        public boolean success;
        public String message;
        public Object data;

        public ApiResponse(boolean success, String message, Object data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }
    }
}

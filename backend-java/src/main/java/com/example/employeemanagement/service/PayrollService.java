package com.example.employeemanagement.service;

import com.example.employeemanagement.entity.Payroll;
import com.example.employeemanagement.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Payroll Service - Business logic for payroll operations
 */
@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    // Generate or get payslip
    public Optional<Payroll> getPayslip(Integer employeeId, Integer month, Integer year) {
        return payrollRepository.findByEmployeeIdAndMonthAndYear(employeeId, month, year);
    }

    // Get all payroll for employee
    public List<Payroll> getEmployeePayroll(Integer employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }

    // Get payroll for month
    public List<Payroll> getMonthlyPayroll(Integer month, Integer year) {
        return payrollRepository.findByMonthAndYear(month, year);
    }

    // Create payroll
    public Payroll createPayroll(Payroll payroll) {
        // Calculate net salary
        Double netSalary = payroll.getSalary() + (payroll.getBonus() != null ? payroll.getBonus() : 0)
                - (payroll.getDeductions() != null ? payroll.getDeductions() : 0)
                - (payroll.getTax() != null ? payroll.getTax() : 0);
        payroll.setNetSalary(netSalary);
        return payrollRepository.save(payroll);
    }

    // Update payroll
    public Payroll updatePayroll(Integer id, Payroll payrollDetails) {
        Optional<Payroll> payroll = payrollRepository.findById(id);
        if (payroll.isPresent()) {
            Payroll p = payroll.get();
            if (payrollDetails.getBonus() != null) p.setBonus(payrollDetails.getBonus());
            if (payrollDetails.getDeductions() != null) p.setDeductions(payrollDetails.getDeductions());
            if (payrollDetails.getTax() != null) p.setTax(payrollDetails.getTax());
            if (payrollDetails.getStatus() != null) p.setStatus(payrollDetails.getStatus());
            
            // Recalculate net salary
            Double netSalary = p.getSalary() + (p.getBonus() != null ? p.getBonus() : 0)
                    - (p.getDeductions() != null ? p.getDeductions() : 0)
                    - (p.getTax() != null ? p.getTax() : 0);
            p.setNetSalary(netSalary);
            
            return payrollRepository.save(p);
        }
        return null;
    }

    // Delete payroll
    public boolean deletePayroll(Integer id) {
        if (payrollRepository.existsById(id)) {
            payrollRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get total salary expense
    public Double getTotalSalaryExpense(Integer month, Integer year) {
        List<Payroll> payrolls = payrollRepository.findByMonthAndYear(month, year);
        return payrolls.stream()
                .mapToDouble(Payroll::getNetSalary)
                .sum();
    }
}

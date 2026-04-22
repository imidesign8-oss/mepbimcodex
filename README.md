# Payroll and HRMS Software

This repository now contains a lightweight Payroll + HRMS system implemented in Python with SQLite persistence.

## Features

- Employee master records (employee code, department, role, hourly rate)
- Attendance capture by date and hours
- Leave request lifecycle (pending, approved, rejected)
- Monthly payroll generation with:
  - Gross pay
  - Tax deduction (10%)
  - Benefit deduction (3%)
  - Net pay
- CLI-based operations for quick local usage

## Quick Start

```bash
python3 payroll_hrms.py --help
```

### Example workflow

```bash
python3 payroll_hrms.py add-employee E001 "Jane Doe" Engineering Developer 50
python3 payroll_hrms.py record-attendance 1 2026-03-01 8
python3 payroll_hrms.py record-attendance 1 2026-03-02 8
python3 payroll_hrms.py request-leave 1 2026-03-03 Sick --notes "Fever"
python3 payroll_hrms.py set-leave-status 1 approved
python3 payroll_hrms.py run-payroll 2026 3
```

## Testing

```bash
pytest -q
```

from datetime import date
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from payroll_hrms import PayrollHRMS


def test_employee_and_payroll_flow(tmp_path):
    db_file = tmp_path / "test.db"
    app = PayrollHRMS(str(db_file))

    emp = app.add_employee("E001", "Jane Doe", "Engineering", "Developer", 50)
    app.record_attendance(emp.id, date(2026, 3, 1), 8)
    app.record_attendance(emp.id, date(2026, 3, 2), 8)

    leave_id = app.request_leave(emp.id, date(2026, 3, 3), "Sick", "Fever")
    app.set_leave_status(leave_id, "approved")

    runs = app.run_monthly_payroll(2026, 3)
    app.close()

    assert len(runs) == 1
    run = runs[0]
    assert run.hours_worked == 16
    assert run.gross_pay == 800
    assert run.tax_deduction == 80
    assert run.benefit_deduction == 24
    assert run.net_pay == 696

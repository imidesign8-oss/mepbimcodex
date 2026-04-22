#!/usr/bin/env python3
"""Payroll and HRMS software with SQLite persistence and CLI workflows."""

from __future__ import annotations

import argparse
import calendar
import json
import sqlite3
from dataclasses import dataclass
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Iterable


@dataclass
class Employee:
    id: int
    employee_code: str
    full_name: str
    department: str
    role: str
    hourly_rate: float
    is_active: bool


@dataclass
class PayrollResult:
    employee_id: int
    period: str
    hours_worked: float
    gross_pay: float
    tax_deduction: float
    benefit_deduction: float
    net_pay: float


class PayrollHRMS:
    def __init__(self, db_path: str = "hrms_payroll.db") -> None:
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row
        self._init_db()

    def close(self) -> None:
        self.conn.close()

    def _init_db(self) -> None:
        self.conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_code TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                department TEXT NOT NULL,
                role TEXT NOT NULL,
                hourly_rate REAL NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id INTEGER NOT NULL,
                work_date TEXT NOT NULL,
                hours REAL NOT NULL,
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            );

            CREATE TABLE IF NOT EXISTS leave_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id INTEGER NOT NULL,
                leave_date TEXT NOT NULL,
                leave_type TEXT NOT NULL,
                status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')),
                notes TEXT,
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            );

            CREATE TABLE IF NOT EXISTS payroll_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id INTEGER NOT NULL,
                period TEXT NOT NULL,
                hours_worked REAL NOT NULL,
                gross_pay REAL NOT NULL,
                tax_deduction REAL NOT NULL,
                benefit_deduction REAL NOT NULL,
                net_pay REAL NOT NULL,
                generated_at TEXT NOT NULL,
                UNIQUE(employee_id, period),
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            );
            """
        )
        self.conn.commit()

    def add_employee(
        self,
        employee_code: str,
        full_name: str,
        department: str,
        role: str,
        hourly_rate: float,
    ) -> Employee:
        cur = self.conn.execute(
            """
            INSERT INTO employees (employee_code, full_name, department, role, hourly_rate, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (employee_code, full_name, department, role, hourly_rate, datetime.now(UTC).isoformat()),
        )
        self.conn.commit()
        return self.get_employee(cur.lastrowid)

    def get_employee(self, employee_id: int) -> Employee:
        row = self.conn.execute(
            "SELECT * FROM employees WHERE id = ?", (employee_id,)
        ).fetchone()
        if row is None:
            raise ValueError(f"Employee {employee_id} not found")
        return Employee(
            id=row["id"],
            employee_code=row["employee_code"],
            full_name=row["full_name"],
            department=row["department"],
            role=row["role"],
            hourly_rate=row["hourly_rate"],
            is_active=bool(row["is_active"]),
        )

    def list_employees(self) -> list[Employee]:
        rows = self.conn.execute(
            "SELECT * FROM employees WHERE is_active = 1 ORDER BY full_name"
        ).fetchall()
        return [
            Employee(
                id=row["id"],
                employee_code=row["employee_code"],
                full_name=row["full_name"],
                department=row["department"],
                role=row["role"],
                hourly_rate=row["hourly_rate"],
                is_active=bool(row["is_active"]),
            )
            for row in rows
        ]

    def record_attendance(self, employee_id: int, work_date: date, hours: float) -> None:
        if hours <= 0 or hours > 24:
            raise ValueError("hours must be greater than 0 and less than or equal to 24")
        self.get_employee(employee_id)
        self.conn.execute(
            "INSERT INTO attendance (employee_id, work_date, hours) VALUES (?, ?, ?)",
            (employee_id, work_date.isoformat(), hours),
        )
        self.conn.commit()

    def request_leave(
        self,
        employee_id: int,
        leave_date: date,
        leave_type: str,
        notes: str = "",
    ) -> int:
        self.get_employee(employee_id)
        cur = self.conn.execute(
            """
            INSERT INTO leave_requests (employee_id, leave_date, leave_type, status, notes)
            VALUES (?, ?, ?, 'pending', ?)
            """,
            (employee_id, leave_date.isoformat(), leave_type, notes),
        )
        self.conn.commit()
        return int(cur.lastrowid)

    def set_leave_status(self, request_id: int, status: str) -> None:
        if status not in {"approved", "rejected"}:
            raise ValueError("status must be approved or rejected")
        cur = self.conn.execute(
            "UPDATE leave_requests SET status = ? WHERE id = ?", (status, request_id)
        )
        if cur.rowcount == 0:
            raise ValueError(f"Leave request {request_id} not found")
        self.conn.commit()

    def _month_range(self, year: int, month: int) -> tuple[str, str]:
        start = date(year, month, 1)
        end = date(year, month, calendar.monthrange(year, month)[1])
        return start.isoformat(), end.isoformat()

    def run_monthly_payroll(self, year: int, month: int) -> list[PayrollResult]:
        period = f"{year:04d}-{month:02d}"
        start, end = self._month_range(year, month)
        employees = self.list_employees()
        results: list[PayrollResult] = []

        for employee in employees:
            hours_worked = (
                self.conn.execute(
                    """
                    SELECT COALESCE(SUM(hours), 0)
                    FROM attendance
                    WHERE employee_id = ? AND work_date BETWEEN ? AND ?
                    """,
                    (employee.id, start, end),
                ).fetchone()[0]
                or 0.0
            )
            gross = round(hours_worked * employee.hourly_rate, 2)
            tax = round(gross * 0.1, 2)
            benefits = round(gross * 0.03, 2)
            net = round(gross - tax - benefits, 2)
            result = PayrollResult(
                employee_id=employee.id,
                period=period,
                hours_worked=hours_worked,
                gross_pay=gross,
                tax_deduction=tax,
                benefit_deduction=benefits,
                net_pay=net,
            )
            self.conn.execute(
                """
                INSERT INTO payroll_runs (
                    employee_id, period, hours_worked, gross_pay,
                    tax_deduction, benefit_deduction, net_pay, generated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(employee_id, period) DO UPDATE SET
                    hours_worked = excluded.hours_worked,
                    gross_pay = excluded.gross_pay,
                    tax_deduction = excluded.tax_deduction,
                    benefit_deduction = excluded.benefit_deduction,
                    net_pay = excluded.net_pay,
                    generated_at = excluded.generated_at
                """,
                (
                    result.employee_id,
                    result.period,
                    result.hours_worked,
                    result.gross_pay,
                    result.tax_deduction,
                    result.benefit_deduction,
                    result.net_pay,
                    datetime.now(UTC).isoformat(),
                ),
            )
            results.append(result)
        self.conn.commit()
        return results


def _as_json(data: Iterable[object]) -> str:
    return json.dumps([obj.__dict__ for obj in data], indent=2)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Payroll and HRMS CLI")
    parser.add_argument("--db", default="hrms_payroll.db", help="Path to SQLite database")
    sub = parser.add_subparsers(dest="command", required=True)

    add_emp = sub.add_parser("add-employee", help="Add employee")
    add_emp.add_argument("employee_code")
    add_emp.add_argument("full_name")
    add_emp.add_argument("department")
    add_emp.add_argument("role")
    add_emp.add_argument("hourly_rate", type=float)

    list_emp = sub.add_parser("list-employees", help="List active employees")
    list_emp.set_defaults(_marker=True)

    attendance = sub.add_parser("record-attendance", help="Record daily attendance")
    attendance.add_argument("employee_id", type=int)
    attendance.add_argument("work_date", help="YYYY-MM-DD")
    attendance.add_argument("hours", type=float)

    leave = sub.add_parser("request-leave", help="Create leave request")
    leave.add_argument("employee_id", type=int)
    leave.add_argument("leave_date", help="YYYY-MM-DD")
    leave.add_argument("leave_type", help="Sick/Casual/Annual")
    leave.add_argument("--notes", default="")

    approve = sub.add_parser("set-leave-status", help="Approve or reject leave")
    approve.add_argument("request_id", type=int)
    approve.add_argument("status", choices=["approved", "rejected"])

    payroll = sub.add_parser("run-payroll", help="Run monthly payroll")
    payroll.add_argument("year", type=int)
    payroll.add_argument("month", type=int)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    app = PayrollHRMS(args.db)
    try:
        if args.command == "add-employee":
            employee = app.add_employee(
                args.employee_code,
                args.full_name,
                args.department,
                args.role,
                args.hourly_rate,
            )
            print(json.dumps(employee.__dict__, indent=2))
        elif args.command == "list-employees":
            print(_as_json(app.list_employees()))
        elif args.command == "record-attendance":
            app.record_attendance(
                args.employee_id,
                datetime.strptime(args.work_date, "%Y-%m-%d").date(),
                args.hours,
            )
            print("Attendance saved")
        elif args.command == "request-leave":
            request_id = app.request_leave(
                args.employee_id,
                datetime.strptime(args.leave_date, "%Y-%m-%d").date(),
                args.leave_type,
                args.notes,
            )
            print(f"Leave request created: {request_id}")
        elif args.command == "set-leave-status":
            app.set_leave_status(args.request_id, args.status)
            print("Leave status updated")
        elif args.command == "run-payroll":
            results = app.run_monthly_payroll(args.year, args.month)
            print(_as_json(results))
    finally:
        app.close()


if __name__ == "__main__":
    main()

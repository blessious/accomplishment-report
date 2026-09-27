import { randomUUID } from "node:crypto";
import type { Employee, Holiday, Office, Report, ReportEntry } from "@/lib/lgu-data";
import { hashPassword, type SessionUser } from "./auth.server";
import { db, execute, query } from "./db.server";

export type AppState = {
  offices: Office[];
  employees: Employee[];
  holidays: Holiday[];
  reports: Report[];
  currentUserId: string | null;
};

const GENERAL_OFFICE_ID = "00000000-0000-4000-8000-000000000000";

const DEFAULT_OFFICES = [
  [GENERAL_OFFICE_ID, "LGU", "Municipality of Boac"],
  ["00000000-0000-4000-8000-000000000009", "MAYOR", "Office of the Mayor"],
  ["00000000-0000-4000-8000-000000000001", "MPDO", "Municipal Planning and Development Office"],
  ["00000000-0000-4000-8000-000000000002", "MEO", "Municipal Engineering Office"],
  ["00000000-0000-4000-8000-000000000003", "MHO", "Municipal Health Office"],
  ["00000000-0000-4000-8000-000000000004", "HRMO", "Human Resource Management Office"],
  ["00000000-0000-4000-8000-000000000005", "MAO", "Municipal Agriculture Office"],
  [
    "00000000-0000-4000-8000-000000000006",
    "MSWDO",
    "Municipal Social Welfare and Development Office",
  ],
  ["00000000-0000-4000-8000-000000000007", "MBO", "Municipal Budget Office"],
  ["00000000-0000-4000-8000-000000000008", "MTO", "Municipal Treasurer's Office"],
] as const;

export async function ensureDefaultOffices() {
  for (const [id, code, name] of DEFAULT_OFFICES) {
    await execute("INSERT IGNORE INTO offices (id, code, name, active) VALUES (?, ?, ?, 1)", [
      id,
      code,
      name,
    ]);
  }
}

export async function ensureGeneralOffice() {
  const offices = await query<Array<{ id: string }>>(
    "SELECT id FROM offices WHERE code = 'LGU' LIMIT 1",
  );
  if (offices[0]) return offices[0].id;
  await execute(
    "INSERT INTO offices (id, code, name, active) VALUES (?, 'LGU', 'Municipality of Boac', 1)",
    [GENERAL_OFFICE_ID],
  );
  return GENERAL_OFFICE_ID;
}

type DbUser = {
  id: string;
  username: string;
  full_name: string;
  nickname: string | null;
  position_title: string;
  office_id: string;
  role: "employee" | "admin";
  active: number;
  must_change_password: number;
  noted_by_name: string;
  noted_by_position: string;
};

export async function ensureInitialAdmin() {
  await ensureDefaultOffices();
  const rows = await query<Array<{ total: number }>>(
    "SELECT COUNT(*) AS total FROM users WHERE role = 'admin'",
  );
  if ((rows[0]?.total ?? 0) > 0) return;
  const username = process.env["INITIAL_ADMIN_USERNAME"];
  const password = process.env["INITIAL_ADMIN_PASSWORD"];
  if (!username || !password) return;
  const officeCode = process.env["INITIAL_ADMIN_OFFICE_CODE"] ?? "HRMO";
  const offices = await query<Array<{ id: string }>>(
    "SELECT id FROM offices WHERE code = ? LIMIT 1",
    [officeCode],
  );
  const officeId = offices[0]?.id;
  if (!officeId) return;
  await execute(
    `INSERT INTO users
       (id, username, password_hash, full_name, position_title, office_id, role, active,
        noted_by_name, noted_by_position, must_change_password)
     VALUES (?, ?, ?, ?, ?, ?, 'admin', 1, ?, ?, 1)`,
    [
      randomUUID(),
      username.trim().toLowerCase(),
      await hashPassword(password),
      process.env["INITIAL_ADMIN_NAME"] ?? "LGU System Administrator",
      process.env["INITIAL_ADMIN_POSITION"] ?? "System Administrator",
      officeId,
      process.env["INITIAL_ADMIN_NAME"] ?? "LGU System Administrator",
      process.env["INITIAL_ADMIN_POSITION"] ?? "System Administrator",
    ],
  );
}

function mapEmployee(user: DbUser): Employee {
  return {
    id: user.id,
    username: user.username,
    password: "",
    fullName: user.full_name,
    nickname: user.nickname ?? "",
    position: user.position_title,
    officeId: user.office_id,
    role: user.role,
    active: Boolean(user.active),
    mustChangePassword: Boolean(user.must_change_password),
    notedByName: user.noted_by_name,
    notedByPosition: user.noted_by_position,
  };
}

async function readEntries(reportId: string): Promise<ReportEntry[]> {
  const entries = await query<
    Array<{ id: string; entry_date: string; entry_label: ReportEntry["label"] }>
  >(
    "SELECT id, entry_date, entry_label FROM report_entries WHERE report_id = ? ORDER BY entry_date",
    [reportId],
  );
  if (!entries.length) return [];
  const [itemRows] = await db.query(
    `SELECT entry_id, content FROM accomplishment_items
      WHERE entry_id IN (${entries.map(() => "?").join(",")}) ORDER BY entry_id, position_index`,
    entries.map((entry) => entry.id),
  );
  const items = itemRows as Array<{ entry_id: string; content: string }>;
  const byEntry = new Map<string, string[]>();
  for (const item of items)
    byEntry.set(item.entry_id, [...(byEntry.get(item.entry_id) ?? []), item.content]);
  return entries.map((entry) => ({
    date: entry.entry_date,
    items: byEntry.get(entry.id) ?? [],
    ...(entry.entry_label ? { label: entry.entry_label } : {}),
  }));
}

export async function getAppState(user: SessionUser): Promise<AppState> {
  await ensureInitialAdmin();
  const [offices, holidays, userRows, reportRows] = await Promise.all([
    query<Array<{ id: string; code: string; name: string; active: number }>>(
      "SELECT id, code, name, active FROM offices ORDER BY code",
    ),
    query<Array<{ id: string; holiday_date: string; name: string; type: "Regular" | "Special" }>>(
      "SELECT id, holiday_date, name, type FROM holidays ORDER BY holiday_date",
    ),
    user.role === "admin"
      ? query<DbUser[]>(
          `SELECT id, username, full_name, nickname, position_title, office_id, role, active,
                  must_change_password,
                  noted_by_name, noted_by_position FROM users ORDER BY full_name`,
        )
      : query<DbUser[]>(
          `SELECT id, username, full_name, nickname, position_title, office_id, role, active,
                  must_change_password,
                  noted_by_name, noted_by_position FROM users WHERE id = ?`,
          [user.id],
        ),
    user.role === "admin"
      ? query<
          Array<{
            id: string;
            employee_id: string;
            title: string;
            office_id: string;
            period_start: string;
            period_end: string;
            status: "Draft" | "Finalized";
            updated_at: string;
            noted_by_name: string;
            noted_by_position: string;
          }>
        >(
          "SELECT id, employee_id, title, office_id, period_start, period_end, status, updated_at, noted_by_name, noted_by_position FROM reports ORDER BY updated_at DESC",
        )
      : query<
          Array<{
            id: string;
            employee_id: string;
            title: string;
            office_id: string;
            period_start: string;
            period_end: string;
            status: "Draft" | "Finalized";
            updated_at: string;
            noted_by_name: string;
            noted_by_position: string;
          }>
        >(
          "SELECT id, employee_id, title, office_id, period_start, period_end, status, updated_at, noted_by_name, noted_by_position FROM reports WHERE employee_id = ? ORDER BY updated_at DESC",
          [user.id],
        ),
  ]);
  const reports: Report[] = await Promise.all(
    reportRows.map(async (report) => ({
      id: report.id,
      employeeId: report.employee_id,
      title: report.title,
      officeId: report.office_id,
      periodStart: report.period_start,
      periodEnd: report.period_end,
      status: report.status,
      updatedAt: new Date(report.updated_at).toISOString(),
      entries: await readEntries(report.id),
      notedByName: report.noted_by_name,
      notedByPosition: report.noted_by_position,
    })),
  );
  return {
    offices: offices.map((office) => ({ ...office, active: Boolean(office.active) })),
    employees: userRows.map(mapEmployee),
    holidays: holidays.map((holiday) => ({
      id: holiday.id,
      date: holiday.holiday_date,
      name: holiday.name,
      type: holiday.type,
    })),
    reports,
    currentUserId: user.id,
  };
}

export async function saveReport(employee: SessionUser, report: Report) {
  if (employee.role !== "admin" && report.employeeId !== employee.id)
    throw new Error("You cannot edit this report.");
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [existingResult] = await connection.query("SELECT id FROM reports WHERE id = ?", [
      report.id,
    ]);
    const existingRows = existingResult as Array<{ id: string }>;
    if (existingRows.length) {
      await connection.execute(
        `UPDATE reports SET title=?, office_id=?, period_start=?, period_end=?, status=?,
         noted_by_name=?, noted_by_position=?, updated_at=NOW() WHERE id=?`,
        [
          report.title,
          report.officeId,
          report.periodStart,
          report.periodEnd,
          report.status,
          report.notedByName,
          report.notedByPosition,
          report.id,
        ],
      );
      await connection.execute("DELETE FROM report_entries WHERE report_id = ?", [report.id]);
    } else {
      await connection.execute(
        `INSERT INTO reports
         (id, employee_id, title, office_id, period_start, period_end, status, prepared_by_name,
          prepared_by_position, noted_by_name, noted_by_position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          report.id,
          report.employeeId,
          report.title,
          report.officeId,
          report.periodStart,
          report.periodEnd,
          report.status,
          employee.fullName,
          employee.position,
          report.notedByName,
          report.notedByPosition,
        ],
      );
    }
    for (const entry of report.entries) {
      const entryId = randomUUID();
      await connection.execute(
        "INSERT INTO report_entries (id, report_id, entry_date, entry_label) VALUES (?, ?, ?, ?)",
        [entryId, report.id, entry.date, entry.label ?? null],
      );
      for (const [position, content] of entry.items.entries()) {
        if (!content.trim()) continue;
        await connection.execute(
          "INSERT INTO accomplishment_items (id, entry_id, position_index, content) VALUES (?, ?, ?, ?)",
          [randomUUID(), entryId, position, content.trim()],
        );
      }
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

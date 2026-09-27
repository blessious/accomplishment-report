import { randomBytes, randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import type { Employee, Holiday, Office, Report } from "./lgu-data";
import {
  clearSession,
  getUserById,
  getSessionUser,
  hashPassword,
  issueSession,
  requireAdmin,
  requireSession,
  verifyPassword,
} from "@/server/auth.server";
import { db, ensureDatabaseCompatibility, execute, query } from "@/server/db.server";
import { ensureInitialAdmin, getAppState, saveReport, type AppState } from "@/server/state.server";

const passwordSchema = z.string().min(8, "Password must be at least 8 characters.").max(128);
const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(64)
  .regex(/^[a-zA-Z0-9._-]+$/, "Use letters, numbers, dots, hyphens, or underscores only.");
const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(180),
  nickname: z.string().trim().max(80),
  position: z.string().trim().min(2).max(180),
  officeId: z.string().uuid(),
  notedByName: z.string().trim().min(2).max(180),
  notedByPosition: z.string().trim().min(2).max(180),
});
const employeeAccountSchema = z.object({
  username: usernameSchema,
  fullName: z.string().trim().min(2).max(180),
  nickname: z.string().trim().max(80),
  position: z.string().trim().min(2).max(180),
  officeId: z.string().uuid(),
  role: z.enum(["employee", "admin"]),
  notedByName: z.string().trim().min(2).max(180),
  notedByPosition: z.string().trim().min(2).max(180),
});
const reportSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  title: z.string().trim().min(1).max(220),
  officeId: z.string().uuid(),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["Draft", "Finalized"]),
  updatedAt: z.string(),
  entries: z
    .array(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        items: z.array(z.string().trim().max(4000)),
        label: z.string().trim().min(1).max(40).optional(),
      }),
    )
    .max(730),
  notedByName: z.string().trim().min(2).max(180),
  notedByPosition: z.string().trim().min(2).max(180),
});

function noStore() {
  setResponseHeader("Cache-Control", "no-store");
  setResponseHeader("Vary", "Cookie");
}

async function stateForUser(user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>) {
  if (!user.mustChangePassword) return getAppState(user);
  const employee: Employee = {
    id: user.id,
    username: user.username,
    password: "",
    fullName: user.fullName,
    nickname: user.nickname,
    position: user.position,
    officeId: user.officeId,
    role: user.role,
    active: user.active,
    mustChangePassword: true,
    notedByName: user.notedByName,
    notedByPosition: user.notedByPosition,
  };
  return {
    offices: [],
    employees: [employee],
    holidays: [],
    reports: [],
    currentUserId: user.id,
  } satisfies AppState;
}

export const getSessionState = createServerFn({ method: "GET" }).handler(
  async (): Promise<AppState> => {
    noStore();
    await ensureDatabaseCompatibility();
    await ensureInitialAdmin();
    const user = await getSessionUser();
    if (user) return stateForUser(user);
    const [offices, holidays] = await Promise.all([
      query<Array<{ id: string; code: string; name: string; active: number }>>(
        "SELECT id, code, name, active FROM offices WHERE active=1 ORDER BY code",
      ),
      query<Array<{ id: string; holiday_date: string; name: string; type: "Regular" | "Special" }>>(
        "SELECT id, holiday_date, name, type FROM holidays ORDER BY holiday_date",
      ),
    ]);
    return {
      offices: offices.map((office) => ({ ...office, active: Boolean(office.active) })),
      holidays: holidays.map((holiday) => ({
        id: holiday.id,
        date: holiday.holiday_date,
        name: holiday.name,
        type: holiday.type,
      })),
      employees: [],
      reports: [],
      currentUserId: null,
    };
  },
);

export const registerAccount = createServerFn({ method: "POST" })
  .validator(profileSchema.extend({ username: usernameSchema, password: passwordSchema }))
  .handler(async ({ data }) => {
    noStore();
    await ensureDatabaseCompatibility();
    await ensureInitialAdmin();
    const username = data.username.toLowerCase();
    const existing = await query<Array<{ id: string }>>(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [username],
    );
    if (existing.length) throw new Error("That username is already taken.");
    const office = await query<Array<{ id: string }>>(
      "SELECT id FROM offices WHERE id = ? AND active = 1",
      [data.officeId],
    );
    if (!office.length) throw new Error("Please select an active office.");
    const officeId = data.officeId;
    const userId = randomUUID();
    await execute(
      `INSERT INTO users
       (id, username, password_hash, full_name, nickname, position_title, office_id, role, active, noted_by_name, noted_by_position)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'employee', 1, ?, ?)`,
      [
        userId,
        username,
        await hashPassword(data.password),
        data.fullName,
        data.nickname,
        data.position,
        officeId,
        data.notedByName,
        data.notedByPosition,
      ],
    );
    await issueSession(userId);
    const user = await getUserById(userId);
    if (!user) throw new Error("Your account could not be started.");
    return stateForUser(user);
  });

export const loginAccount = createServerFn({ method: "POST" })
  .validator(z.object({ username: usernameSchema, password: z.string().min(1).max(128) }))
  .handler(async ({ data }) => {
    noStore();
    await ensureDatabaseCompatibility();
    await ensureInitialAdmin();
    const rows = await query<Array<{ id: string; password_hash: string; active: number }>>(
      "SELECT id, password_hash, active FROM users WHERE username = ? LIMIT 1",
      [data.username.toLowerCase()],
    );
    const candidate = rows[0];
    const correct = candidate
      ? await verifyPassword(data.password, candidate.password_hash)
      : false;
    if (!candidate || !correct || !candidate.active)
      throw new Error("Invalid username or password.");
    await issueSession(candidate.id);
    const user = await getUserById(candidate.id);
    if (!user) throw new Error("Your account could not be started.");
    return stateForUser(user);
  });

export const logoutAccount = createServerFn({ method: "POST" }).handler(async () => {
  noStore();
  await clearSession();
  return { ok: true };
});

export const updateProfile = createServerFn({ method: "POST" })
  .validator(profileSchema)
  .handler(async ({ data }) => {
    noStore();
    await ensureDatabaseCompatibility();
    const user = await requireSession();
    await execute(
      `UPDATE users SET full_name=?, nickname=?, position_title=?, office_id=?, noted_by_name=?, noted_by_position=? WHERE id=?`,
      [
        data.fullName,
        data.nickname,
        data.position,
        data.officeId,
        data.notedByName,
        data.notedByPosition,
        user.id,
      ],
    );
    // Reports inherit the employee's current office so previews and Word
    // exports stay consistent after a profile change.
    await execute("UPDATE reports SET office_id=? WHERE employee_id=?", [data.officeId, user.id]);
    const updated = await requireSession();
    return getAppState(updated);
  });

export const changePassword = createServerFn({ method: "POST" })
  .validator(z.object({ currentPassword: z.string().min(1), nextPassword: passwordSchema }))
  .handler(async ({ data }) => {
    noStore();
    const user = await requireSession({ allowPasswordChange: true });
    const rows = await query<Array<{ password_hash: string }>>(
      "SELECT password_hash FROM users WHERE id=?",
      [user.id],
    );
    if (!rows[0] || !(await verifyPassword(data.currentPassword, rows[0].password_hash)))
      throw new Error("Current password is incorrect.");
    await execute("UPDATE users SET password_hash=?, must_change_password=0 WHERE id=?", [
      await hashPassword(data.nextPassword),
      user.id,
    ]);
    await issueSession(user.id);
    return { ok: true };
  });

export const upsertReport = createServerFn({ method: "POST" })
  .validator(reportSchema)
  .handler(async ({ data }) => {
    noStore();
    const user = await requireSession();
    if (data.periodEnd < data.periodStart)
      throw new Error("The end date must be on or after the start date.");
    await saveReport(user, data as Report);
    return getAppState(user);
  });

export const deleteReport = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    noStore();
    const user = await requireSession();
    const rows = await query<Array<{ employee_id: string }>>(
      "SELECT employee_id FROM reports WHERE id=?",
      [data.id],
    );
    const report = rows[0];
    if (!report) return getAppState(user);
    if (user.role !== "admin" && report.employee_id !== user.id)
      throw new Error("You cannot delete this report.");
    await execute("DELETE FROM reports WHERE id=?", [data.id]);
    return getAppState(user);
  });

export const resetEmployeePassword = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    noStore();
    const admin = await requireAdmin();
    if (data.userId === admin.id) throw new Error("Use your profile to change your own password.");
    const rows = await query<Array<{ id: string }>>("SELECT id FROM users WHERE id=?", [
      data.userId,
    ]);
    if (!rows.length) throw new Error("Employee account not found.");
    const temporaryPassword = randomBytes(12).toString("base64url");
    await execute("UPDATE users SET password_hash=?, must_change_password=1 WHERE id=?", [
      await hashPassword(temporaryPassword),
      data.userId,
    ]);
    await execute("DELETE FROM sessions WHERE user_id=?", [data.userId]);
    return { temporaryPassword };
  });

export const createEmployeeAccount = createServerFn({ method: "POST" })
  .validator(employeeAccountSchema)
  .handler(async ({ data }) => {
    noStore();
    await ensureDatabaseCompatibility();
    const admin = await requireAdmin();
    const username = data.username.toLowerCase();
    const duplicate = await query<Array<{ id: string }>>("SELECT id FROM users WHERE username=?", [
      username,
    ]);
    if (duplicate.length) throw new Error("That username is already taken.");
    const offices = await query<Array<{ id: string }>>(
      "SELECT id FROM offices WHERE id=? AND active=1",
      [data.officeId],
    );
    if (!offices.length) throw new Error("Please select an active office.");

    const temporaryPassword = randomBytes(12).toString("base64url");
    const userId = randomUUID();
    try {
      await execute(
        `INSERT INTO users
         (id, username, password_hash, full_name, nickname, position_title, office_id, role, active,
          noted_by_name, noted_by_position, must_change_password)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, 1)`,
        [
          userId,
          username,
          await hashPassword(temporaryPassword),
          data.fullName,
          data.nickname,
          data.position,
          data.officeId,
          data.role,
          data.notedByName,
          data.notedByPosition,
        ],
      );
    } catch (error) {
      if ((error as { code?: string }).code === "ER_DUP_ENTRY")
        throw new Error("That username is already taken.");
      throw error;
    }
    const currentAdmin = await getUserById(admin.id);
    if (!currentAdmin) throw new Error("Your administrator session has expired.");
    return { state: await getAppState(currentAdmin), temporaryPassword };
  });

async function updateEmployeeAccountRecord(
  actorId: string,
  employeeId: string,
  details: {
    username: string;
    fullName: string;
    nickname: string;
    position: string;
    officeId: string;
    role: "employee" | "admin";
    notedByName: string;
    notedByPosition: string;
    active?: boolean;
  },
) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [adminResult] = await connection.query(
      "SELECT id, active FROM users WHERE role='admin' FOR UPDATE",
    );
    const adminRows = adminResult as Array<{ id: string; active: number }>;
    const [targetResult] = await connection.query(
      "SELECT id, role, active FROM users WHERE id=? FOR UPDATE",
      [employeeId],
    );
    const target = (
      targetResult as Array<{ id: string; role: "employee" | "admin"; active: number }>
    )[0];
    if (!target) throw new Error("Employee account not found.");

    const nextActive = details.active ?? Boolean(target.active);
    if (employeeId === actorId && !nextActive)
      throw new Error("You cannot deactivate your own administrator account.");
    const removesActiveAdmin =
      target.role === "admin" &&
      Boolean(target.active) &&
      (!nextActive || details.role !== "admin");
    if (removesActiveAdmin && adminRows.filter((row) => Boolean(row.active)).length <= 1)
      throw new Error("At least one active administrator account must remain.");

    await connection.execute(
      `UPDATE users SET username=?, full_name=?, nickname=?, position_title=?, office_id=?, role=?,
       noted_by_name=?, noted_by_position=?, active=? WHERE id=?`,
      [
        details.username,
        details.fullName,
        details.nickname,
        details.position,
        details.officeId,
        details.role,
        details.notedByName,
        details.notedByPosition,
        nextActive ? 1 : 0,
        employeeId,
      ],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export const updateEmployeeAccount = createServerFn({ method: "POST" })
  .validator(employeeAccountSchema.extend({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    noStore();
    const admin = await requireAdmin();
    const username = data.username.toLowerCase();
    const duplicates = await query<Array<{ id: string }>>(
      "SELECT id FROM users WHERE username=? AND id<>?",
      [username, data.userId],
    );
    if (duplicates.length) throw new Error("That username is already taken.");
    const offices = await query<Array<{ id: string }>>(
      `SELECT id FROM offices
        WHERE id=? AND (active=1 OR id=(SELECT office_id FROM users WHERE id=?))`,
      [data.officeId, data.userId],
    );
    if (!offices.length) throw new Error("Please select an active office.");
    try {
      await updateEmployeeAccountRecord(admin.id, data.userId, { ...data, username });
    } catch (error) {
      if ((error as { code?: string }).code === "ER_DUP_ENTRY")
        throw new Error("That username is already taken.");
      throw error;
    }
    const currentAdmin = await getUserById(admin.id);
    if (!currentAdmin) throw new Error("Your administrator session has expired.");
    return getAppState(currentAdmin);
  });

export const setEmployeeActive = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.string().uuid(), active: z.boolean() }))
  .handler(async ({ data }) => {
    noStore();
    const admin = await requireAdmin();
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [adminResult] = await connection.query(
        "SELECT id, active FROM users WHERE role='admin' FOR UPDATE",
      );
      const adminRows = adminResult as Array<{ id: string; active: number }>;
      const [targetResult] = await connection.query(
        "SELECT id, role, active FROM users WHERE id=? FOR UPDATE",
        [data.userId],
      );
      const target = (
        targetResult as Array<{ id: string; role: "employee" | "admin"; active: number }>
      )[0];
      if (!target) throw new Error("Employee account not found.");
      if (data.userId === admin.id && !data.active)
        throw new Error("You cannot deactivate your own administrator account.");
      if (
        target.role === "admin" &&
        Boolean(target.active) &&
        !data.active &&
        adminRows.filter((row) => Boolean(row.active)).length <= 1
      ) {
        throw new Error("At least one active administrator account must remain.");
      }
      await connection.execute("UPDATE users SET active=? WHERE id=?", [
        data.active ? 1 : 0,
        data.userId,
      ]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    const currentAdmin = await getUserById(admin.id);
    if (!currentAdmin) throw new Error("Your administrator session has expired.");
    return getAppState(currentAdmin);
  });

export const syncOffices = createServerFn({ method: "POST" })
  .validator(
    z.array(
      z.object({
        id: z.string().uuid(),
        code: z.string().trim().min(2).max(24),
        name: z.string().trim().min(2).max(180),
        active: z.boolean(),
      }),
    ),
  )
  .handler(async ({ data }) => {
    noStore();
    const user = await requireAdmin();
    for (const office of data) {
      await execute(
        `INSERT INTO offices (id, code, name, active) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE code=VALUES(code), name=VALUES(name), active=VALUES(active)`,
        [office.id, office.code.toUpperCase(), office.name, office.active ? 1 : 0],
      );
    }
    return getAppState(user);
  });

export const syncHolidays = createServerFn({ method: "POST" })
  .validator(
    z.array(
      z.object({
        id: z.string().uuid(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        name: z.string().trim().min(2).max(180),
        type: z.enum(["Regular", "Special"]),
      }),
    ),
  )
  .handler(async ({ data }) => {
    noStore();
    const user = await requireAdmin();
    const ids = data.map((holiday) => holiday.id);
    if (ids.length)
      await execute(`DELETE FROM holidays WHERE id NOT IN (${ids.map(() => "?").join(",")})`, ids);
    else await execute("DELETE FROM holidays");
    for (const holiday of data) {
      await execute(
        `INSERT INTO holidays (id, holiday_date, name, type) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE holiday_date=VALUES(holiday_date), name=VALUES(name), type=VALUES(type)`,
        [holiday.id, holiday.date, holiday.name, holiday.type],
      );
    }
    return getAppState(user);
  });

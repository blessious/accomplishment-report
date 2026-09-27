import { randomBytes, createHash, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";
import { execute, query } from "./db.server";

export type SessionUser = {
  id: string;
  username: string;
  fullName: string;
  nickname: string;
  position: string;
  officeId: string;
  role: "employee" | "admin";
  active: boolean;
  notedByName: string;
  notedByPosition: string;
  mustChangePassword: boolean;
};

const SESSION_COOKIE = "lgu_ar_session";
const SESSION_DAYS = 7;

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function isSecureCookie() {
  return process.env["APP_SECURE_COOKIES"] === "true";
}

function readCookie(name: string) {
  const cookie = getRequestHeader("cookie");
  if (!cookie) return null;
  for (const part of cookie.split(/;\s*/)) {
    const index = part.indexOf("=");
    if (index > 0 && part.slice(0, index) === name) return part.slice(index + 1);
  }
  return null;
}

function setCookie(value: string, maxAge: number) {
  const secure = isSecureCookie() ? "; Secure" : "";
  setResponseHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`,
  );
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function issueSession(userId: string) {
  const rawToken = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  await execute("DELETE FROM sessions WHERE user_id = ?", [userId]);
  await execute("INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)", [
    randomUUID(),
    userId,
    tokenHash(rawToken),
    expiresAt,
  ]);
  setCookie(rawToken, SESSION_DAYS * 24 * 60 * 60);
}

export async function clearSession() {
  const token = readCookie(SESSION_COOKIE);
  if (token) await execute("DELETE FROM sessions WHERE token_hash = ?", [tokenHash(token)]);
  setCookie("", 0);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = readCookie(SESSION_COOKIE);
  if (!token) return null;
  const rows = await query<
    Array<{
      id: string;
      username: string;
      full_name: string;
      nickname: string | null;
      position_title: string;
      office_id: string;
      role: "employee" | "admin";
      active: number;
      noted_by_name: string;
      noted_by_position: string;
      must_change_password: number;
    }>
  >(
    `SELECT u.id, u.username, u.full_name, u.nickname, u.position_title, u.office_id, u.role, u.active,
            u.noted_by_name, u.noted_by_position, u.must_change_password
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > NOW() LIMIT 1`,
    [tokenHash(token)],
  );
  const user = rows[0];
  if (!user || !user.active) return null;
  await execute("UPDATE sessions SET last_seen_at = NOW() WHERE token_hash = ?", [
    tokenHash(token),
  ]);
  return {
    id: user.id,
    username: user.username,
    fullName: user.full_name,
    nickname: user.nickname ?? "",
    position: user.position_title,
    officeId: user.office_id,
    role: user.role,
    active: Boolean(user.active),
    notedByName: user.noted_by_name,
    notedByPosition: user.noted_by_position,
    mustChangePassword: Boolean(user.must_change_password),
  };
}

export async function getUserById(userId: string): Promise<SessionUser | null> {
  const rows = await query<
    Array<{
      id: string;
      username: string;
      full_name: string;
      nickname: string | null;
      position_title: string;
      office_id: string;
      role: "employee" | "admin";
      active: number;
      noted_by_name: string;
      noted_by_position: string;
      must_change_password: number;
    }>
  >(
    `SELECT id, username, full_name, nickname, position_title, office_id, role, active,
            noted_by_name, noted_by_position, must_change_password
       FROM users WHERE id = ? LIMIT 1`,
    [userId],
  );
  const user = rows[0];
  if (!user || !user.active) return null;
  return {
    id: user.id,
    username: user.username,
    fullName: user.full_name,
    nickname: user.nickname ?? "",
    position: user.position_title,
    officeId: user.office_id,
    role: user.role,
    active: Boolean(user.active),
    notedByName: user.noted_by_name,
    notedByPosition: user.noted_by_position,
    mustChangePassword: Boolean(user.must_change_password),
  };
}

export async function requireSession(options: { allowPasswordChange?: boolean } = {}) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  if (user.mustChangePassword && !options.allowPasswordChange)
    throw new Error("You must change your temporary password before continuing.");
  return user;
}

export async function requireAdmin() {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Administrator access is required.");
  return user;
}

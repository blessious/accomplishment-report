import mysql from "mysql2/promise";

type SqlValue = string | number | boolean | null | Date;

const config = {
  host: process.env["MYSQL_HOST"] ?? "127.0.0.1",
  port: Number(process.env["MYSQL_PORT"] ?? "3306"),
  user: process.env["MYSQL_USER"] ?? "root",
  password: process.env["MYSQL_PASSWORD"] ?? "",
  database: process.env["MYSQL_DATABASE"] ?? "boac_accomplishment_hub",
};

export const db = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  charset: "utf8mb4_unicode_ci",
});

export async function query<T>(sql: string, values: SqlValue[] = []) {
  const [rows] = await db.query(sql, values);
  return rows as T;
}

export async function execute(sql: string, values: SqlValue[] = []) {
  const [result] = await db.execute(sql, values);
  return result;
}

let compatibilityPromise: Promise<void> | null = null;

export function ensureDatabaseCompatibility() {
  if (!compatibilityPromise) {
    compatibilityPromise = query<Array<{ column_exists: number }>>(
      `SELECT COUNT(*) AS column_exists
         FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'nickname'`,
      [config.database],
    )
      .then(async ([result]) => {
        if ((result?.column_exists ?? 0) === 0) {
          try {
            await execute("ALTER TABLE users ADD COLUMN nickname VARCHAR(80) NULL AFTER full_name");
          } catch (error) {
            const code = (error as { code?: string }).code;
            if (code !== "ER_DUP_FIELDNAME") throw error;
          }
        }
      })
      .catch((error) => {
        compatibilityPromise = null;
        throw error;
      });
  }
  return compatibilityPromise;
}

CREATE DATABASE IF NOT EXISTS boac_accomplishment_hub
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE boac_accomplishment_hub;

CREATE TABLE IF NOT EXISTS offices (
  id CHAR(36) PRIMARY KEY,
  code VARCHAR(24) NOT NULL,
  name VARCHAR(180) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_offices_code (code)
);

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(180) NOT NULL,
  nickname VARCHAR(80) NULL,
  position_title VARCHAR(180) NOT NULL,
  office_id CHAR(36) NOT NULL,
  role ENUM('employee', 'admin') NOT NULL DEFAULT 'employee',
  active TINYINT(1) NOT NULL DEFAULT 1,
  noted_by_name VARCHAR(180) NOT NULL,
  noted_by_position VARCHAR(180) NOT NULL,
  must_change_password TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_username (username),
  KEY idx_users_office_id (office_id),
  CONSTRAINT fk_users_office FOREIGN KEY (office_id) REFERENCES offices(id)
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(80) NULL AFTER full_name;

CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_sessions_token_hash (token_hash),
  KEY idx_sessions_user_expires (user_id, expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS holidays (
  id CHAR(36) PRIMARY KEY,
  holiday_date DATE NOT NULL,
  name VARCHAR(180) NOT NULL,
  type ENUM('Regular', 'Special') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_holidays_date (holiday_date)
);

CREATE TABLE IF NOT EXISTS reports (
  id CHAR(36) PRIMARY KEY,
  employee_id CHAR(36) NOT NULL,
  title VARCHAR(220) NOT NULL,
  office_id CHAR(36) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status ENUM('Draft', 'Finalized') NOT NULL DEFAULT 'Draft',
  prepared_by_name VARCHAR(180) NOT NULL,
  prepared_by_position VARCHAR(180) NOT NULL,
  noted_by_name VARCHAR(180) NOT NULL,
  noted_by_position VARCHAR(180) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_reports_employee_updated (employee_id, updated_at),
  KEY idx_reports_office_period (office_id, period_start, period_end),
  CONSTRAINT fk_reports_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reports_office FOREIGN KEY (office_id) REFERENCES offices(id)
);

CREATE TABLE IF NOT EXISTS report_entries (
  id CHAR(36) PRIMARY KEY,
  report_id CHAR(36) NOT NULL,
  entry_date DATE NOT NULL,
  entry_label VARCHAR(40) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_report_entries_date (report_id, entry_date),
  CONSTRAINT fk_report_entries_report FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS accomplishment_items (
  id CHAR(36) PRIMARY KEY,
  entry_id CHAR(36) NOT NULL,
  position_index INT NOT NULL,
  content TEXT NOT NULL,
  CONSTRAINT fk_accomplishment_items_entry FOREIGN KEY (entry_id) REFERENCES report_entries(id) ON DELETE CASCADE,
  UNIQUE KEY uq_item_position (entry_id, position_index)
);

INSERT IGNORE INTO offices (id, code, name, active) VALUES
  ('00000000-0000-4000-8000-000000000000', 'LGU', 'Municipality of Boac', 1),
  ('00000000-0000-4000-8000-000000000009', 'MAYOR', 'Office of the Mayor', 1),
  ('00000000-0000-4000-8000-000000000001', 'MPDO', 'Municipal Planning and Development Office', 1),
  ('00000000-0000-4000-8000-000000000002', 'MEO', 'Municipal Engineering Office', 1),
  ('00000000-0000-4000-8000-000000000003', 'MHO', 'Municipal Health Office', 1),
  ('00000000-0000-4000-8000-000000000004', 'HRMO', 'Human Resource Management Office', 1),
  ('00000000-0000-4000-8000-000000000005', 'MAO', 'Municipal Agriculture Office', 1),
  ('00000000-0000-4000-8000-000000000006', 'MSWDO', 'Municipal Social Welfare and Development Office', 1),
  ('00000000-0000-4000-8000-000000000007', 'MBO', 'Municipal Budget Office', 1),
  ('00000000-0000-4000-8000-000000000008', 'MTO', 'Municipal Treasurer''s Office', 1);

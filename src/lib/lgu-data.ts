export type Role = "employee" | "admin";
export type ReportStatus = "Draft" | "Finalized";
export type HolidayType = "Regular" | "Special";

export interface Office {
  id: string;
  code: string;
  name: string;
  active: boolean;
}

export interface Employee {
  id: string;
  username: string;
  password: string;
  fullName: string;
  nickname?: string;
  position: string;
  officeId: string;
  role: Role;
  active: boolean;
  mustChangePassword?: boolean;
  notedByName: string;
  notedByPosition: string;
}

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  type: HolidayType;
}

export interface ReportEntry {
  date: string; // YYYY-MM-DD
  items: string[];
  label?: string;
}

export interface Report {
  id: string;
  employeeId: string;
  title: string;
  officeId: string;
  periodStart: string;
  periodEnd: string;
  status: ReportStatus;
  updatedAt: string;
  entries: ReportEntry[];
  notedByName: string;
  notedByPosition: string;
}

export const OFFICES: Office[] = [
  { id: "off-mpdo", code: "MPDO", name: "Municipal Planning and Development Office", active: true },
  { id: "off-meo", code: "MEO", name: "Municipal Engineering Office", active: true },
  { id: "off-mho", code: "MHO", name: "Municipal Health Office", active: true },
  { id: "off-hrmo", code: "HRMO", name: "Human Resource Management Office", active: true },
  { id: "off-mao", code: "MAO", name: "Municipal Agriculture Office", active: true },
  {
    id: "off-mswdo",
    code: "MSWDO",
    name: "Municipal Social Welfare and Development Office",
    active: true,
  },
  { id: "off-mbo", code: "MBO", name: "Municipal Budget Office", active: true },
  { id: "off-mto", code: "MTO", name: "Municipal Treasurer's Office", active: true },
  {
    id: "off-mdrrmo",
    code: "MDRRMO",
    name: "Municipal Disaster Risk Reduction and Management Office",
    active: false,
  },
];

export const EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    username: "rmanzano",
    password: "boac2026",
    fullName: "Rosalinda M. Manzano",
    position: "Administrative Officer II",
    officeId: "off-mpdo",
    role: "employee",
    active: true,
    notedByName: "Engr. Alfonso D. Ricafrente",
    notedByPosition: "Municipal Planning and Development Coordinator",
  },
  {
    id: "emp-2",
    username: "jsalvador",
    password: "boac2026",
    fullName: "Jomar P. Salvador",
    position: "Engineering Assistant",
    officeId: "off-meo",
    role: "employee",
    active: true,
    notedByName: "Engr. Ma. Cristina L. Sarmiento",
    notedByPosition: "Municipal Engineer",
  },
  {
    id: "emp-3",
    username: "mlarazo",
    password: "boac2026",
    fullName: "Ma. Luisa T. Larazo",
    position: "Nurse II",
    officeId: "off-mho",
    role: "employee",
    active: true,
    notedByName: "Dr. Ferdinand C. Nepomuceno",
    notedByPosition: "Municipal Health Officer",
  },
  {
    id: "emp-4",
    username: "cvillamor",
    password: "boac2026",
    fullName: "Carlito B. Villamor",
    position: "Agricultural Technologist",
    officeId: "off-mao",
    role: "employee",
    active: false,
    notedByName: "Ana Marie D. Pastor",
    notedByPosition: "Municipal Agriculturist",
  },
  {
    id: "emp-admin",
    username: "hrmo.admin",
    password: "admin2026",
    fullName: "Editha G. Palomares",
    position: "Human Resource Management Officer IV",
    officeId: "off-hrmo",
    role: "admin",
    active: true,
    notedByName: "Hon. Armando A. Padilla",
    notedByPosition: "Municipal Mayor",
  },
];

export const HOLIDAYS: Holiday[] = [
  { id: "h-1", date: "2026-01-01", name: "New Year's Day", type: "Regular" },
  {
    id: "h-2",
    date: "2026-02-25",
    name: "EDSA People Power Revolution Anniversary",
    type: "Special",
  },
  { id: "h-3", date: "2026-04-02", name: "Maundy Thursday", type: "Regular" },
  { id: "h-4", date: "2026-04-03", name: "Good Friday", type: "Regular" },
  { id: "h-5", date: "2026-04-09", name: "Araw ng Kagitingan", type: "Regular" },
  { id: "h-6", date: "2026-05-01", name: "Labor Day", type: "Regular" },
  { id: "h-7", date: "2026-06-12", name: "Independence Day", type: "Regular" },
  { id: "h-8", date: "2026-08-21", name: "Ninoy Aquino Day", type: "Special" },
  { id: "h-9", date: "2026-08-31", name: "National Heroes Day", type: "Regular" },
  { id: "h-10", date: "2026-10-18", name: "Boac Town Fiesta (Local Holiday)", type: "Special" },
  { id: "h-11", date: "2026-11-01", name: "All Saints' Day", type: "Special" },
  { id: "h-12", date: "2026-11-30", name: "Bonifacio Day", type: "Regular" },
  { id: "h-13", date: "2026-12-25", name: "Christmas Day", type: "Regular" },
  { id: "h-14", date: "2026-12-30", name: "Rizal Day", type: "Regular" },
];

const sampleItems = [
  "Encoded and validated barangay profiles for the Comprehensive Development Plan",
  "Attended the Municipal Development Council meeting as recording secretary",
  "Prepared purchase requests for office supplies (RIS No. 2026-0142)",
  "Conducted field validation of proposed farm-to-market road in Brgy. Balagasan",
  "Consolidated monthly accomplishment reports of section personnel",
  "Assisted walk-in clients on business permit locational clearance queries",
];

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function seedEntries(start: string, end: string, seed: number): ReportEntry[] {
  return eachDateInPeriod(start, end).map((date, i) => {
    const d = parseISO(date);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    if (weekend) return { date, items: [] };
    return {
      date,
      items: [
        sampleItems[(i + seed) % sampleItems.length]!,
        sampleItems[(i + seed + 2) % sampleItems.length]!,
      ],
    };
  });
}

export const REPORTS: Report[] = [
  {
    id: "rep-1",
    employeeId: "emp-1",
    title: "Accomplishment Report — 1st Half of March 2026",
    officeId: "off-mpdo",
    periodStart: "2026-03-01",
    periodEnd: "2026-03-15",
    status: "Finalized",
    updatedAt: "2026-03-16T08:24:00.000Z",
    entries: seedEntries("2026-03-01", "2026-03-15", 0),
    notedByName: "Engr. Alfonso D. Ricafrente",
    notedByPosition: "Municipal Planning and Development Coordinator",
  },
  {
    id: "rep-2",
    employeeId: "emp-1",
    title: "Accomplishment Report — 2nd Half of March 2026",
    officeId: "off-mpdo",
    periodStart: "2026-03-16",
    periodEnd: "2026-03-31",
    status: "Draft",
    updatedAt: "2026-03-28T02:10:00.000Z",
    entries: seedEntries("2026-03-16", "2026-03-31", 1),
    notedByName: "Engr. Alfonso D. Ricafrente",
    notedByPosition: "Municipal Planning and Development Coordinator",
  },
  {
    id: "rep-3",
    employeeId: "emp-2",
    title: "Accomplishment Report — 1st Half of April 2026",
    officeId: "off-meo",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-15",
    status: "Finalized",
    updatedAt: "2026-04-16T01:00:00.000Z",
    entries: seedEntries("2026-04-01", "2026-04-15", 3),
    notedByName: "Engr. Ma. Cristina L. Sarmiento",
    notedByPosition: "Municipal Engineer",
  },
  {
    id: "rep-4",
    employeeId: "emp-3",
    title: "Accomplishment Report — 1st Half of April 2026",
    officeId: "off-mho",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-15",
    status: "Draft",
    updatedAt: "2026-04-14T07:45:00.000Z",
    entries: seedEntries("2026-04-01", "2026-04-15", 4),
    notedByName: "Dr. Ferdinand C. Nepomuceno",
    notedByPosition: "Municipal Health Officer",
  },
];

/* ---------- date helpers ---------- */

export function parseISO(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function toISO(d: Date): string {
  return iso(d);
}

export function eachDateInPeriod(start: string, end: string): string[] {
  const out: string[] = [];
  const s = parseISO(start);
  const e = parseISO(end);
  if (e < s) return out;
  const cur = new Date(s);
  let guard = 0;
  while (cur <= e && guard < 200) {
    out.push(iso(cur));
    cur.setDate(cur.getDate() + 1);
    guard++;
  }
  return out;
}

export function daysInPeriod(start: string, end: string): number {
  return eachDateInPeriod(start, end).length;
}

export function dayName(date: string): string {
  return parseISO(date).toLocaleDateString("en-PH", { weekday: "long" });
}

export function isWeekend(date: string): boolean {
  const day = parseISO(date).getDay();
  return day === 0 || day === 6;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function monthEnd(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function formatLongDate(date: string): string {
  const d = parseISO(date);
  return `${MONTHS[d.getMonth()]!} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShortDate(date: string): string {
  const d = parseISO(date);
  return `${MONTHS[d.getMonth()]!.slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "March 1–15, 2026" or "March 28 – April 3, 2026" */
export function formatPeriod(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${MONTHS[s.getMonth()]!} ${s.getDate()}–${e.getDate()}, ${e.getFullYear()}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${MONTHS[s.getMonth()]!} ${s.getDate()} – ${MONTHS[e.getMonth()]!} ${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${formatLongDate(start)} – ${formatLongDate(end)}`;
}

export function monthLabel(date: string): string {
  const d = parseISO(date);
  return `${MONTHS[d.getMonth()]!} ${d.getFullYear()}`;
}

export function monthKey(date: string): string {
  return date.slice(0, 7);
}

export function monthKeyLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]!} ${y}`;
}

export function relativeUpdated(isoTs: string): string {
  const d = new Date(isoTs);
  return d.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export { MONTHS };

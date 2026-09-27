import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  changePassword,
  deleteReport as deleteReportOnServer,
  getSessionState,
  loginAccount,
  logoutAccount,
  registerAccount,
  resetEmployeePassword,
  createEmployeeAccount as createEmployeeAccountOnServer,
  setEmployeeActive as setEmployeeActiveOnServer,
  syncHolidays,
  syncOffices,
  updateEmployeeAccount as updateEmployeeAccountOnServer,
  updateProfile,
  upsertReport,
} from "./app.functions";
import {
  eachDateInPeriod,
  type Employee,
  type Holiday,
  type Office,
  type Report,
  type ReportEntry,
} from "./lgu-data";

interface State {
  offices: Office[];
  employees: Employee[];
  holidays: Holiday[];
  reports: Report[];
  currentUserId: string | null;
}

const emptyState: State = {
  offices: [],
  employees: [],
  holidays: [],
  reports: [],
  currentUserId: null,
};

type Ctx = {
  state: State;
  loading: boolean;
  currentUser: Employee | null;
  officeOf: (id: string) => Office | undefined;
  employeeOf: (id: string) => Employee | undefined;
  holidayOn: (date: string) => Holiday | undefined;
  refresh: () => Promise<void>;
  login: (
    username: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string; role?: "employee" | "admin"; name?: string }>;
  register: (
    data: Omit<Employee, "id" | "role" | "active" | "password" | "nickname"> & {
      password: string;
      nickname: string;
    },
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateCurrentUser: (patch: Partial<Employee>) => void;
  changeCurrentPassword: (
    currentPassword: string,
    nextPassword: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  createEmployeeAccount: (
    data: EmployeeAccountDetails,
  ) => Promise<{ ok: boolean; error?: string; temporaryPassword?: string }>;
  updateEmployeeAccount: (
    userId: string,
    data: EmployeeAccountDetails,
  ) => Promise<{ ok: boolean; error?: string }>;
  setEmployeeActive: (userId: string, active: boolean) => Promise<{ ok: boolean; error?: string }>;
  createReport: (report: Report) => void;
  updateReport: (id: string, patch: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  duplicateReport: (id: string) => string | null;
  setOffices: (fn: (list: Office[]) => Office[]) => void;
  setHolidays: (fn: (list: Holiday[]) => Holiday[]) => void;
  issueTemporaryPassword: (
    userId: string,
  ) => Promise<{ ok: boolean; error?: string; temporaryPassword?: string }>;
};

type EmployeeAccountDetails = Omit<
  Pick<
    Employee,
    | "username"
    | "fullName"
    | "nickname"
    | "position"
    | "officeId"
    | "role"
    | "notedByName"
    | "notedByPosition"
  >,
  "nickname"
> & { nickname: string };

const StoreContext = React.createContext<Ctx | null>(null);

export function buildEntries(
  start: string,
  end: string,
  existing: ReportEntry[] = [],
): ReportEntry[] {
  const map = new Map(existing.map((entry) => [entry.date, entry]));
  return eachDateInPeriod(start, end).map((date) => {
    const existingEntry = map.get(date);
    return {
      date,
      items: [...(existingEntry?.items ?? [])],
      ...(existingEntry?.label ? { label: existingEntry.label } : {}),
    };
  });
}

export function newId(_prefix?: string) {
  // randomUUID is unavailable in some browsers when the LAN app is served
  // over plain HTTP. Keep IDs UUID-shaped for the server validator.
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(emptyState);
  const [loading, setLoading] = React.useState(true);
  const getStateFn = useServerFn(getSessionState);
  const loginFn = useServerFn(loginAccount);
  const registerFn = useServerFn(registerAccount);
  const logoutFn = useServerFn(logoutAccount);
  const updateProfileFn = useServerFn(updateProfile);
  const changePasswordFn = useServerFn(changePassword);
  const upsertReportFn = useServerFn(upsertReport);
  const deleteReportFn = useServerFn(deleteReportOnServer);
  const createEmployeeFn = useServerFn(createEmployeeAccountOnServer);
  const updateEmployeeFn = useServerFn(updateEmployeeAccountOnServer);
  const setEmployeeActiveFn = useServerFn(setEmployeeActiveOnServer);
  const syncOfficesFn = useServerFn(syncOffices);
  const syncHolidaysFn = useServerFn(syncHolidays);
  const resetPasswordFn = useServerFn(resetEmployeePassword);

  const applyState = React.useCallback((next: State) => setState(next), []);
  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      applyState(await getStateFn());
    } finally {
      setLoading(false);
    }
  }, [applyState, getStateFn]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const persistReport = React.useCallback(
    (report: Report) => {
      void upsertReportFn({ data: report })
        .then(applyState)
        .catch(() => void refresh());
    },
    [applyState, refresh, upsertReportFn],
  );

  const value = React.useMemo<Ctx>(() => {
    const currentUser =
      state.employees.find((employee) => employee.id === state.currentUserId) ?? null;
    return {
      state,
      loading,
      currentUser,
      officeOf: (id) => state.offices.find((office) => office.id === id),
      employeeOf: (id) => state.employees.find((employee) => employee.id === id),
      holidayOn: (date) => state.holidays.find((holiday) => holiday.date === date),
      refresh,
      login: async (username, password) => {
        try {
          const next = await loginFn({ data: { username, password } });
          applyState(next);
          const signedInUser = next.employees.find(
            (employee) => employee.id === next.currentUserId,
          );
          if (signedInUser) {
            return { ok: true, role: signedInUser.role, name: signedInUser.fullName };
          }
          return { ok: true };
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : "Sign in failed." };
        }
      },
      register: async (data) => {
        try {
          applyState(await registerFn({ data }));
          return { ok: true };
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : "Registration failed.",
          };
        }
      },
      logout: () => {
        setState(emptyState);
        void logoutFn().catch(() => undefined);
      },
      updateCurrentUser: (patch) => {
        if (!currentUser) return;
        const updated = { ...currentUser, ...patch };
        setState((previous) => ({
          ...previous,
          employees: previous.employees.map((employee) =>
            employee.id === updated.id ? updated : employee,
          ),
          reports: previous.reports.map((report) =>
            report.employeeId === updated.id ? { ...report, officeId: updated.officeId } : report,
          ),
        }));
        void updateProfileFn({
          data: {
            fullName: updated.fullName,
            nickname: updated.nickname ?? "",
            position: updated.position,
            officeId: updated.officeId,
            notedByName: updated.notedByName,
            notedByPosition: updated.notedByPosition,
          },
        })
          .then(applyState)
          .catch(() => void refresh());
      },
      changeCurrentPassword: async (currentPassword, nextPassword) => {
        try {
          await changePasswordFn({ data: { currentPassword, nextPassword } });
          await refresh();
          return { ok: true };
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : "Password change failed.",
          };
        }
      },
      createReport: (report) => {
        setState((previous) => ({ ...previous, reports: [report, ...previous.reports] }));
        persistReport(report);
      },
      updateReport: (id, patch) => {
        setState((previous) => {
          const report = previous.reports.find((item) => item.id === id);
          if (!report) return previous;
          const updated = { ...report, ...patch, updatedAt: new Date().toISOString() };
          persistReport(updated);
          return {
            ...previous,
            reports: previous.reports.map((item) => (item.id === id ? updated : item)),
          };
        });
      },
      deleteReport: (id) => {
        setState((previous) => ({
          ...previous,
          reports: previous.reports.filter((report) => report.id !== id),
        }));
        void deleteReportFn({ data: { id } })
          .then(applyState)
          .catch(() => void refresh());
      },
      duplicateReport: (id) => {
        const source = state.reports.find((report) => report.id === id);
        if (!source) return null;
        const copy: Report = {
          ...source,
          id: newId(),
          title: `${source.title} (Copy)`,
          status: "Draft",
          updatedAt: new Date().toISOString(),
          entries: source.entries.map((entry) => ({
            date: entry.date,
            items: [...entry.items],
            ...(entry.label ? { label: entry.label } : {}),
          })),
        };
        setState((previous) => ({ ...previous, reports: [copy, ...previous.reports] }));
        persistReport(copy);
        return copy.id;
      },
      createEmployeeAccount: async (data) => {
        try {
          const result = await createEmployeeFn({ data });
          applyState(result.state);
          return { ok: true, temporaryPassword: result.temporaryPassword };
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : "Account creation failed.",
          };
        }
      },
      updateEmployeeAccount: async (userId, data) => {
        try {
          applyState(await updateEmployeeFn({ data: { userId, ...data } }));
          return { ok: true };
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : "Account update failed.",
          };
        }
      },
      setEmployeeActive: async (userId, active) => {
        try {
          applyState(await setEmployeeActiveFn({ data: { userId, active } }));
          return { ok: true };
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : "Account status update failed.",
          };
        }
      },
      setOffices: (fn) => {
        const next = fn(state.offices);
        setState((previous) => ({ ...previous, offices: next }));
        void syncOfficesFn({ data: next })
          .then(applyState)
          .catch(() => void refresh());
      },
      setHolidays: (fn) => {
        const next = fn(state.holidays);
        setState((previous) => ({ ...previous, holidays: next }));
        void syncHolidaysFn({ data: next })
          .then(applyState)
          .catch(() => void refresh());
      },
      issueTemporaryPassword: async (userId) => {
        try {
          const result = await resetPasswordFn({ data: { userId } });
          await refresh();
          return { ok: true, temporaryPassword: result.temporaryPassword };
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : "Password reset failed.",
          };
        }
      },
    };
  }, [
    applyState,
    changePasswordFn,
    createEmployeeFn,
    deleteReportFn,
    loading,
    loginFn,
    logoutFn,
    persistReport,
    refresh,
    registerFn,
    resetPasswordFn,
    state,
    setEmployeeActiveFn,
    syncHolidaysFn,
    syncOfficesFn,
    updateEmployeeFn,
    updateProfileFn,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = React.useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}

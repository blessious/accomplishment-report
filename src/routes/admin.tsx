import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clipboard, Download, Eye, KeyRound, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { newId, useStore } from "@/lib/store";
import {
  formatPeriod,
  formatShortDate,
  monthKey,
  monthKeyLabel,
  relativeUpdated,
  type Holiday,
  type Office,
  type Report,
} from "@/lib/lgu-data";
import { downloadWord } from "@/lib/word-export";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Boac LGU Accomplishment Report Maker" },
      {
        name: "description",
        content:
          "HRMO administration for all municipal accomplishment reports, employees, offices, and Philippine holidays.",
      },
      { property: "og:title", content: "Administration — Boac LGU Report Maker" },
      {
        property: "og:description",
        content:
          "Oversee reports, personnel, offices, and holiday calendars for the Municipality of Boac.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { currentUser } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) navigate({ to: "/" });
    else if (currentUser.role !== "admin") navigate({ to: "/dashboard" });
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <AppShell>
      <section className="border-b border-border pb-8 sm:pb-10">
        <h1 className="text-2xl font-semibold tracking-tight">Administration</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Human Resource Management Office · Municipality of Boac
        </p>
      </section>

      <Tabs defaultValue="reports" className="mt-8">
        <TabsList>
          <TabsTrigger value="reports">All Reports</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="offices">Offices</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>
        <TabsContent value="reports" className="pt-5">
          <AllReports />
        </TabsContent>
        <TabsContent value="employees" className="pt-5">
          <EmployeesTab />
        </TabsContent>
        <TabsContent value="offices" className="pt-5">
          <OfficesTab />
        </TabsContent>
        <TabsContent value="holidays" className="pt-5">
          <HolidaysTab />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

/* ---------------- All reports ---------------- */

function AllReports() {
  const { state, officeOf, employeeOf } = useStore();
  const [query, setQuery] = React.useState("");
  const [officeId, setOfficeId] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [month, setMonth] = React.useState("all");

  const months = Array.from(new Set(state.reports.map((r) => monthKey(r.periodStart))))
    .sort()
    .reverse();

  const rows = state.reports
    .filter((r) => (officeId === "all" ? true : r.officeId === officeId))
    .filter((r) => (status === "all" ? true : r.status === status))
    .filter((r) => (month === "all" ? true : monthKey(r.periodStart) === month))
    .filter((r) =>
      query.trim()
        ? `${employeeOf(r.employeeId)?.fullName ?? ""} ${r.title}`
            .toLowerCase()
            .includes(query.toLowerCase())
        : true,
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 border-b border-border sm:flex-row sm:items-center">
        <CardTitle className="text-base">{rows.length} report(s) municipality-wide</CardTitle>
        <div className="flex flex-1 flex-wrap gap-2 sm:justify-end">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              className="w-52 pl-8"
              placeholder="Search employee or title"
              aria-label="Search reports"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={officeId} onValueChange={setOfficeId}>
            <SelectTrigger className="w-40" aria-label="Filter by office">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All offices</SelectItem>
              {state.offices.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Finalized">Finalized</SelectItem>
            </SelectContent>
          </Select>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-40" aria-label="Filter by month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {monthKeyLabel(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-0 pt-0 sm:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Office</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Last updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const emp = employeeOf(r.employeeId);
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <span className="font-medium">{emp?.fullName}</span>
                    <span className="block text-xs text-muted-foreground">{emp?.position}</span>
                  </TableCell>
                  <TableCell>{officeOf(r.officeId)?.code}</TableCell>
                  <TableCell>{formatPeriod(r.periodStart, r.periodEnd)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {relativeUpdated(r.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.status === "Finalized" ? "default" : "outline"}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Download Word file"
                        onClick={() => {
                          if (!emp) return;
                          toast.loading("Generating Word document…", { id: r.id });
                          void downloadWord({
                            report: r,
                            employee: emp,
                            office: officeOf(r.officeId),
                            holidays: state.holidays,
                          })
                            .then(() =>
                              toast.success(`Downloaded report of ${emp.fullName}.`, { id: r.id }),
                            )
                            .catch(() =>
                              toast.error("The Word file could not be generated.", { id: r.id }),
                            );
                        }}
                      >
                        <Download className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  No reports match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ---------------- Employees ---------------- */

function EmployeesTab() {
  const {
    state,
    currentUser,
    officeOf,
    setEmployeeActive,
    createEmployeeAccount,
    updateEmployeeAccount,
    issueTemporaryPassword,
  } = useStore();
  const [query, setQuery] = React.useState("");
  const [officeFilter, setOfficeFilter] = React.useState("all");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [editing, setEditing] = React.useState<(typeof state.employees)[number] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [reportsFor, setReportsFor] = React.useState<(typeof state.employees)[number] | null>(null);
  const [tempPw, setTempPw] = React.useState<{
    name: string;
    username: string;
    password: string;
  } | null>(null);
  const emptyForm = {
    username: "",
    fullName: "",
    nickname: "",
    position: "",
    officeId: "",
    role: "employee" as "employee" | "admin",
    notedByName: "",
    notedByPosition: "",
  };
  const [form, setForm] = React.useState(emptyForm);

  const rows = state.employees
    .filter((employee) =>
      query.trim()
        ? `${employee.fullName} ${employee.username} ${employee.position} ${officeOf(employee.officeId)?.code ?? ""}`
            .toLowerCase()
            .includes(query.trim().toLowerCase())
        : true,
    )
    .filter((employee) => officeFilter === "all" || employee.officeId === officeFilter)
    .filter((employee) => roleFilter === "all" || employee.role === roleFilter)
    .filter((employee) =>
      statusFilter === "all" ? true : employee.active === (statusFilter === "active"),
    );

  function startCreate() {
    setEditing(null);
    setForm({ ...emptyForm, officeId: state.offices.find((office) => office.active)?.id ?? "" });
    setFormOpen(true);
  }

  function startEdit(employee: (typeof state.employees)[number]) {
    setEditing(employee);
    setForm({
      username: employee.username,
      fullName: employee.fullName,
      nickname: employee.nickname ?? "",
      position: employee.position,
      officeId: employee.officeId,
      role: employee.role,
      notedByName: employee.notedByName,
      notedByPosition: employee.notedByPosition,
    });
    setFormOpen(true);
  }

  async function saveEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const result = await updateEmployeeAccount(editing.id, form);
        if (!result.ok) {
          toast.error(result.error ?? "Employee account could not be updated.");
          return;
        }
        toast.success("Employee account updated.");
      } else {
        const result = await createEmployeeAccount(form);
        if (!result.ok || !result.temporaryPassword) {
          toast.error(result.error ?? "Employee account could not be created.");
          return;
        }
        setTempPw({
          name: form.fullName,
          username: form.username,
          password: result.temporaryPassword,
        });
        toast.success("Employee account created.");
      }
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border">
        <div>
          <CardTitle className="text-base">Employees directory</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} of {state.employees.length} accounts
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={startCreate}>
          <Plus className="size-4" aria-hidden /> Add employee
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-52 flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              className="w-full pl-8"
              placeholder="Search name, username, position"
              aria-label="Search employees"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={officeFilter} onValueChange={setOfficeFilter}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter by office">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All offices</SelectItem>
              {state.offices.map((office) => (
                <SelectItem key={office.id} value={office.id}>
                  {office.code}
                  {office.active ? "" : " (inactive)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter by role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter by account status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Deactivated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardContent className="px-4 pb-0 pt-0 sm:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Office</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <span className="font-medium">{e.fullName}</span>
                  <span className="block text-xs text-muted-foreground">{e.position}</span>
                </TableCell>
                <TableCell className="font-mono text-xs">{e.username}</TableCell>
                <TableCell>{officeOf(e.officeId)?.code}</TableCell>
                <TableCell>{e.role === "admin" ? "Administrator" : "Employee"}</TableCell>
                <TableCell>
                  <Badge variant={e.active ? "default" : "outline"}>
                    {e.active ? "Active" : "Deactivated"}
                  </Badge>
                  {e.mustChangePassword && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Password change required
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={e.id === currentUser?.id}
                      title={
                        e.id === currentUser?.id ? "Change your own password in Profile" : undefined
                      }
                      onClick={async () => {
                        const result = await issueTemporaryPassword(e.id);
                        if (!result.ok) {
                          toast.error(result.error ?? "Could not issue a temporary password.");
                          return;
                        }
                        if (!result.temporaryPassword) {
                          toast.error("The temporary password was not returned.");
                          return;
                        }
                        setTempPw({
                          name: e.fullName,
                          username: e.username,
                          password: result.temporaryPassword,
                        });
                      }}
                    >
                      <KeyRound className="size-3.5" aria-hidden /> Temp password
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(e)}>
                      <Pencil className="mr-1 size-3.5" aria-hidden /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setReportsFor(e)}>
                      <Eye className="mr-1 size-3.5" aria-hidden /> Reports
                    </Button>
                    <Button
                      variant={e.active ? "outline" : "secondary"}
                      size="sm"
                      onClick={async () => {
                        const result = await setEmployeeActive(e.id, !e.active);
                        if (!result.ok) {
                          toast.error(result.error ?? "Could not update account status.");
                          return;
                        }
                        toast.success(
                          e.active ? `${e.fullName} deactivated.` : `${e.fullName} reactivated.`,
                        );
                      }}
                    >
                      {e.active ? "Deactivate" : "Reactivate"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No employees match the current search and filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit employee account" : "Add employee account"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the employee’s account details and access role."
                : "A temporary password will be generated and shown once after the account is created."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(event) => void saveEmployee(event)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <AccountField
                id="employee-username"
                label="Username"
                value={form.username}
                onChange={(username) => setForm((current) => ({ ...current, username }))}
              />
              <AccountField
                id="employee-full-name"
                label="Full name"
                value={form.fullName}
                onChange={(fullName) => setForm((current) => ({ ...current, fullName }))}
              />
              <AccountField
                id="employee-nickname"
                label="Nickname"
                value={form.nickname}
                onChange={(nickname) => setForm((current) => ({ ...current, nickname }))}
              />
              <AccountField
                id="employee-position"
                label="Position / designation"
                value={form.position}
                onChange={(position) => setForm((current) => ({ ...current, position }))}
              />
              <div className="space-y-2">
                <Label htmlFor="employee-office">Office</Label>
                <Select
                  value={form.officeId}
                  onValueChange={(officeId) => setForm((current) => ({ ...current, officeId }))}
                >
                  <SelectTrigger id="employee-office">
                    <SelectValue placeholder="Select office" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.offices
                      .filter((office) => office.active || office.id === editing?.officeId)
                      .map((office) => (
                        <SelectItem key={office.id} value={office.id}>
                          {office.name}
                          {office.active ? "" : " (inactive; choose an active office)"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-role">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(role) =>
                    setForm((current) => ({ ...current, role: role as "employee" | "admin" }))
                  }
                >
                  <SelectTrigger id="employee-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <AccountField
                id="employee-noted-name"
                label="Default ‘Noted by’ name"
                value={form.notedByName}
                onChange={(notedByName) => setForm((current) => ({ ...current, notedByName }))}
              />
              <AccountField
                id="employee-noted-position"
                label="Default ‘Noted by’ position"
                value={form.notedByPosition}
                onChange={(notedByPosition) =>
                  setForm((current) => ({ ...current, notedByPosition }))
                }
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Create account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!tempPw} onOpenChange={(o) => !o && setTempPw(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Temporary password</DialogTitle>
            <DialogDescription>
              Provide this password securely to {tempPw?.name}. They must change it when they sign
              in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 rounded-sm bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">Username: {tempPw?.username}</p>
            <p className="break-all font-mono text-lg">{tempPw?.password}</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={async () => {
                if (!tempPw) return;
                try {
                  await navigator.clipboard.writeText(tempPw.password);
                  toast.success("Temporary password copied.");
                } catch {
                  toast.error("Could not copy the temporary password.");
                }
              }}
            >
              <Clipboard className="mr-2 size-4" aria-hidden /> Copy password
            </Button>
            <Button onClick={() => setTempPw(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reportsFor} onOpenChange={(open) => !open && setReportsFor(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Report history</DialogTitle>
            <DialogDescription>
              {reportsFor?.fullName} · {reportsFor ? officeOf(reportsFor.officeId)?.name : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reporting period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last updated</TableHead>
                  <TableHead className="text-right">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.reports
                  .filter((report) => report.employeeId === reportsFor?.id)
                  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                  .map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{formatPeriod(report.periodStart, report.periodEnd)}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "Finalized" ? "default" : "outline"}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {relativeUpdated(report.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Download ${formatPeriod(report.periodStart, report.periodEnd)}`}
                          onClick={() => {
                            if (!reportsFor) return;
                            toast.loading("Generating Word document…", { id: report.id });
                            void downloadWord({
                              report,
                              employee: reportsFor,
                              office: officeOf(report.officeId),
                              holidays: state.holidays,
                            })
                              .then(() => toast.success("Word file downloaded.", { id: report.id }))
                              .catch(() =>
                                toast.error("The Word file could not be generated.", {
                                  id: report.id,
                                }),
                              );
                          }}
                        >
                          <Download className="size-4" aria-hidden />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {state.reports.filter((report) => report.employeeId === reportsFor?.id).length ===
                  0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      No reports found for this employee.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function AccountField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        required={id !== "employee-nickname"}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

/* ---------------- Offices ---------------- */

function OfficesTab() {
  const { state, setOffices } = useStore();
  const [editing, setEditing] = React.useState<Office | null>(null);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ code: "", name: "" });

  function startAdd() {
    setEditing(null);
    setForm({ code: "", name: "" });
    setOpen(true);
  }

  function startEdit(o: Office) {
    setEditing(o);
    setForm({ code: o.code, name: o.name });
    setOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-border">
        <CardTitle className="text-base">Offices directory</CardTitle>
        <Button size="sm" className="gap-2" onClick={startAdd}>
          <Plus className="size-4" aria-hidden /> Add office
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-0 pt-0 sm:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Office name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.offices.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.code}</TableCell>
                <TableCell>{o.name}</TableCell>
                <TableCell>
                  <Badge variant={o.active ? "default" : "outline"}>
                    {o.active ? "Active" : "Deactivated"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${o.code}`}
                      onClick={() => startEdit(o)}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant={o.active ? "ghost" : "secondary"}
                      size="sm"
                      onClick={() => {
                        setOffices((list) =>
                          list.map((x) => (x.id === o.id ? { ...x, active: !x.active } : x)),
                        );
                        toast.success(
                          o.active ? `${o.code} deactivated.` : `${o.code} reactivated.`,
                        );
                      }}
                    >
                      {o.active ? "Deactivate" : "Reactivate"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit office" : "Add office"}</DialogTitle>
            <DialogDescription>Office details appear on the report header.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="o-code">Abbreviation</Label>
              <Input
                id="o-code"
                value={form.code}
                placeholder="MPDO"
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="o-name">Full office name</Label>
              <Input
                id="o-name"
                value={form.name}
                placeholder="Municipal Planning and Development Office"
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!form.code.trim() || !form.name.trim()) {
                  toast.error("Both abbreviation and office name are required.");
                  return;
                }
                if (editing) {
                  setOffices((list) =>
                    list.map((x) => (x.id === editing.id ? { ...x, ...form } : x)),
                  );
                  toast.success("Office updated.");
                } else {
                  setOffices((list) => [
                    ...list,
                    { id: newId("off"), code: form.code, name: form.name, active: true },
                  ]);
                  toast.success("Office added.");
                }
                setOpen(false);
              }}
            >
              {editing ? "Save changes" : "Add office"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ---------------- Holidays ---------------- */

function HolidaysTab() {
  const { state, setHolidays } = useStore();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Holiday | null>(null);
  const [form, setForm] = React.useState({ date: "", name: "", type: "Regular" });
  const [pendingDelete, setPendingDelete] = React.useState<Holiday | null>(null);

  const rows = [...state.holidays].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-border">
        <CardTitle className="text-base">Philippine holidays</CardTitle>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => {
            setEditing(null);
            setForm({ date: "", name: "", type: "Regular" });
            setOpen(true);
          }}
        >
          <Plus className="size-4" aria-hidden /> Add holiday
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-0 pt-0 sm:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Holiday</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">{formatShortDate(h.date)}</TableCell>
                <TableCell>{h.name}</TableCell>
                <TableCell>
                  <Badge variant={h.type === "Regular" ? "default" : "secondary"}>{h.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${h.name}`}
                      onClick={() => {
                        setEditing(h);
                        setForm({ date: h.date, name: h.name, type: h.type });
                        setOpen(true);
                      }}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${h.name}`}
                      className="text-destructive hover:text-destructive"
                      onClick={() => setPendingDelete(h)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit holiday" : "Add holiday"}</DialogTitle>
            <DialogDescription>
              Holidays are marked on daily entries; employees may still record work on those dates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="h-date">Date</Label>
              <Input
                id="h-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="h-name">Holiday name</Label>
              <Input
                id="h-name"
                value={form.name}
                placeholder="Araw ng Kagitingan"
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="h-type">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger id="h-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular holiday</SelectItem>
                  <SelectItem value="Special">Special (non-working) day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!form.date || !form.name.trim()) {
                  toast.error("Date and holiday name are required.");
                  return;
                }
                const payload = {
                  date: form.date,
                  name: form.name,
                  type: form.type as Holiday["type"],
                };
                if (editing) {
                  setHolidays((list) =>
                    list.map((x) => (x.id === editing.id ? { ...x, ...payload } : x)),
                  );
                  toast.success("Holiday updated.");
                } else {
                  setHolidays((list) => [...list, { id: newId("h"), ...payload }]);
                  toast.success("Holiday added.");
                }
                setOpen(false);
              }}
            >
              {editing ? "Save changes" : "Add holiday"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete holiday?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `${pendingDelete.name} (${formatShortDate(pendingDelete.date)}) will no longer be marked on reports.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) {
                  setHolidays((list) => list.filter((x) => x.id !== pendingDelete.id));
                  toast.success("Holiday deleted.");
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

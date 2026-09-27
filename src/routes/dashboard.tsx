import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Copy,
  Download,
  FileDown,
  FilePlus2,
  FileText,
  Pencil,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore, buildEntries, newId } from "@/lib/store";
import {
  formatPeriod,
  monthEnd,
  monthKey,
  monthKeyLabel,
  relativeUpdated,
  type Report,
} from "@/lib/lgu-data";
import { downloadWord } from "@/lib/word-export";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Accomplishment Reports — Boac LGU Report Maker" },
      {
        name: "description",
        content:
          "View, edit, duplicate, and export your semi-monthly accomplishment reports for the Municipality of Boac.",
      },
      { property: "og:title", content: "My Accomplishment Reports — Boac LGU" },
      {
        property: "og:description",
        content: "Draft and finalized accomplishment reports in one place.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const store = useStore();
  const { currentUser, state, officeOf, createReport, deleteReport, duplicateReport } = store;
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [month, setMonth] = React.useState("all");
  const [pendingDelete, setPendingDelete] = React.useState<Report | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (!currentUser) navigate({ to: "/" });
  }, [currentUser, navigate]);

  React.useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const interval = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  if (!currentUser) return null;
  const user = currentUser;
  const office = officeOf(user.officeId);
  const preferredName = user.nickname?.trim();
  const hour = now?.getHours();
  const salutation =
    hour === undefined
      ? "Magandang araw"
      : hour < 12
        ? "Magandang umaga"
        : hour < 18
          ? "Magandang hapon"
          : "Magandang gabi";
  const currentTime = now
    ? new Intl.DateTimeFormat("fil-PH", {
        weekday: "long",
        hour: "numeric",
        minute: "2-digit",
      }).format(now)
    : null;

  const mine = state.reports.filter((r) => r.employeeId === currentUser.id);
  const months = Array.from(new Set(mine.map((r) => monthKey(r.periodStart))))
    .sort()
    .reverse();

  const filtered = mine
    .filter((r) => (status === "all" ? true : r.status === status))
    .filter((r) => (month === "all" ? true : monthKey(r.periodStart) === month))
    .filter((r) => (query.trim() ? r.title.toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  function handleCreate(half: 1 | 2) {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const start = `${y}-${String(m + 1).padStart(2, "0")}-${half === 1 ? "01" : "16"}`;
    const end = `${y}-${String(m + 1).padStart(2, "0")}-${half === 1 ? "15" : monthEnd(y, m)}`;
    const report: Report = {
      id: newId("rep"),
      employeeId: user.id,
      officeId: user.officeId,
      title: `Accomplishment Report — ${formatPeriod(start, end)}`,
      periodStart: start,
      periodEnd: end,
      status: "Draft",
      updatedAt: new Date().toISOString(),
      entries: buildEntries(start, end),
      notedByName: user.notedByName,
      notedByPosition: user.notedByPosition,
    };
    createReport(report);
    setIsCreateDialogOpen(false);
    navigate({ to: "/report/$reportId", params: { reportId: report.id } });
  }

  return (
    <AppShell>
      <section className="border-b border-border pb-8 sm:pb-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" aria-hidden /> Iyong workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {salutation}
              {preferredName ? `, ${preferredName}` : ""}.
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {currentTime && <span className="font-medium text-primary">{currentTime}</span>}
              {currentTime && <span aria-hidden>·</span>}
              <span>{user.position}</span>
              <span aria-hidden>·</span>
              <Badge variant="outline" className="border-primary/25 bg-primary/5 text-primary">
                {office?.name ?? "Municipality of Boac"}
              </Badge>
              <span>Keep your reporting periods ready to export.</span>
            </div>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 shadow-lg">
            <FilePlus2 className="size-4" aria-hidden /> Create Report
          </Button>
        </div>
      </section>

      <Card className="mt-8 overflow-hidden">
        <CardHeader className="flex flex-col gap-3 border-b border-border bg-card/80 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-base">Your report library</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} report{filtered.length === 1 ? "" : "s"} shown
            </p>
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reports"
                aria-label="Search reports"
                className="w-full sm:w-56 pl-8"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-36" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Finalized">Finalized</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full sm:w-44" aria-label="Filter by month">
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <FileText className="size-10 text-muted-foreground" aria-hidden />
              <h2 className="text-lg font-medium">No reports yet</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                {mine.length === 0
                  ? "Create your first accomplishment report. Daily entries are generated automatically for the period you select."
                  : "No report matches the current search or filters."}
              </p>
              {mine.length === 0 && (
                <Button onClick={handleCreate} className="mt-2 gap-2">
                  <FilePlus2 className="size-4" aria-hidden /> Create Report
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reporting period</TableHead>
                  <TableHead>Last updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="group hover:bg-muted/45">
                    <TableCell>
                      <span className="font-medium">
                        {formatPeriod(r.periodStart, r.periodEnd)}
                      </span>
                      <span className="block text-xs text-muted-foreground">{r.title}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {relativeUpdated(r.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          r.status === "Finalized"
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "border-chart-4/40 bg-chart-4/10 text-chart-4"
                        }
                        variant={r.status === "Finalized" ? "default" : "outline"}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <IconButton
                          label="Edit report"
                          onClick={() =>
                            navigate({ to: "/report/$reportId", params: { reportId: r.id } })
                          }
                        >
                          <Pencil className="size-4" aria-hidden />
                        </IconButton>
                        <IconButton
                          label="Duplicate report"
                          onClick={() => {
                            const id = duplicateReport(r.id);
                            if (id) toast.success("Report duplicated as a new draft.");
                          }}
                        >
                          <Copy className="size-4" aria-hidden />
                        </IconButton>
                        <IconButton
                          label="Download Word file"
                          onClick={() => {
                            toast.loading("Generating Word document…", { id: r.id });
                            void downloadWord({
                              report: r,
                              employee: currentUser,
                              office: officeOf(r.officeId),
                              holidays: state.holidays,
                            })
                              .then(() => toast.success("Word document downloaded.", { id: r.id }))
                              .catch(() =>
                                toast.error("The Word file could not be generated.", { id: r.id }),
                              );
                          }}
                        >
                          <Download className="size-4" aria-hidden />
                        </IconButton>
                        <IconButton
                          label="Delete report"
                          onClick={() => setPendingDelete(r)}
                          destructive
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <FileDown className="size-3.5" aria-hidden />
        Word exports follow the official Municipality of Boac accomplishment report format.
      </p>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create accomplishment report</DialogTitle>
            <DialogDescription>
              Choose the reporting period before encoding daily accomplishments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-auto min-h-24 items-start justify-start whitespace-normal p-4 text-left"
              onClick={() => handleCreate(1)}
            >
              <span>
                <span className="block font-semibold">1st Half</span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  Days 1–15 of this month
                </span>
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto min-h-24 items-start justify-start whitespace-normal p-4 text-left"
              onClick={() => handleCreate(2)}
            >
              <span>
                <span className="block font-semibold">2nd Half</span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  Days 16–{monthEnd(new Date().getFullYear(), new Date().getMonth())} of this month
                </span>
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this report?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${formatPeriod(pendingDelete.periodStart, pendingDelete.periodEnd)}" and all of its daily entries will be permanently removed. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) {
                  deleteReport(pendingDelete.id);
                  toast.success("Report deleted.");
                }
                setPendingDelete(null);
              }}
            >
              Delete report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function IconButton({
  label,
  onClick,
  children,
  destructive,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={destructive ? "text-destructive hover:text-destructive" : undefined}
    >
      {children}
    </Button>
  );
}

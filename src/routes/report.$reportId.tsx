import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Download,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import {
  dayName,
  formatLongDate,
  formatShortDate,
  formatPeriod,
  isWeekend,
  parseISO,
  type Employee,
  type Holiday,
  type Office,
  type Report,
  type ReportEntry,
} from "@/lib/lgu-data";
import { downloadWord } from "@/lib/word-export";

export const Route = createFileRoute("/report/$reportId")({
  head: () => ({
    meta: [
      { title: "Accomplishment Report Editor — Boac LGU Report Maker" },
      {
        name: "description",
        content:
          "Encode daily accomplishments per calendar date and download the official Municipality of Boac Word document.",
      },
      { property: "og:title", content: "Accomplishment Report Editor — Boac LGU" },
      {
        property: "og:description",
        content: "Focused daily-accomplishment editor with Word export.",
      },
    ],
  }),
  component: EditorPage,
});

type SaveState = "saved" | "saving" | "failed";

function EditorPage() {
  const { reportId } = Route.useParams();
  const { state, currentUser, officeOf, updateReport } = useStore();
  const navigate = useNavigate();
  const report = state.reports.find((r) => r.id === reportId);

  const [draft, setDraft] = React.useState<Report | null>(report ?? null);
  const [saveState, setSaveState] = React.useState<SaveState>("saved");
  const [dirty, setDirty] = React.useState(false);
  const [activeDate, setActiveDate] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (report && !draft) setDraft(report);
  }, [report, draft]);

  React.useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (!currentUser) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Please sign in to edit reports.</p>
      </AppShell>
    );
  }

  if (!report || !draft) {
    return (
      <AppShell>
        <div className="py-16 text-center">
          <h1 className="text-lg font-semibold">Report not found</h1>
          <Button className="mt-4" onClick={() => navigate({ to: "/dashboard" })}>
            Back to my reports
          </Button>
        </div>
      </AppShell>
    );
  }

  const employee = state.employees.find((e) => e.id === draft.employeeId) ?? currentUser;
  const office = officeOf(draft.officeId);
  const completedDays = draft.entries.filter((entry) => entry.items.length > 0).length;
  const accomplishmentCount = draft.entries.reduce((total, entry) => total + entry.items.length, 0);

  function focusDay(date: string) {
    setActiveDate(date);
    window.setTimeout(() => {
      document
        .getElementById(`day-${date}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }

  function commit(next: Report) {
    setDraft(next);
    setDirty(true);
    setSaveState("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      updateReport(next.id, next);
      setSaveState("saved");
      setDirty(false);
    }, 600);
  }

  function patch(p: Partial<Report>) {
    commit({ ...draft!, ...p });
  }

  function updateEntry(date: string, entryPatch: Partial<ReportEntry>) {
    patch({
      entries: draft!.entries.map((entry) =>
        entry.date === date ? { ...entry, ...entryPatch } : entry,
      ),
    });
  }

  const editorPane = (
    <div className="min-w-0 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <CardTitle className="text-base">Daily accomplishments</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Follow the dates below; completed days are marked so gaps stand out immediately.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Badge className="border-0 bg-success/15 text-success hover:bg-success/15">
              {completedDays}/{draft.entries.length} days
            </Badge>
            <Badge variant="outline" className="border-primary/25 bg-primary/5 text-primary">
              {accomplishmentCount} updates
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <nav
            className="border-b border-border px-4 py-3 sm:px-5"
            aria-label="Jump to a reporting date"
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Jump to day
            </p>
            <div
              className="grid grid-cols-4 gap-1.5 sm:grid-cols-8 lg:grid-cols-[repeat(auto-fit,minmax(3.25rem,1fr))]"
              role="list"
            >
              {draft.entries.map((entry) => {
                const completed = entry.items.length > 0;
                const selected = activeDate === entry.date;
                return (
                  <button
                    key={entry.date}
                    type="button"
                    role="listitem"
                    onClick={() => focusDay(entry.date)}
                    className={`relative flex h-11 w-full flex-col items-center justify-center rounded-md border px-1 text-xs font-semibold shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                        : completed
                          ? "border-success/40 bg-success/10 text-success hover:border-success hover:bg-success hover:text-success-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    }`}
                    aria-label={`${formatLongDate(entry.date)}${completed ? ", completed" : ", no update"}`}
                    aria-current={selected ? "date" : undefined}
                  >
                    <span>{parseISO(entry.date).getDate()}</span>
                    <span className="text-[10px] font-normal opacity-75">
                      {dayName(entry.date).slice(0, 3)}
                    </span>
                    {completed && !selected && (
                      <Check
                        className="absolute -right-1 -top-1 size-3 rounded-full bg-success p-0.5 text-success-foreground"
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
          <div className="space-y-2 p-3 sm:p-4">
            {draft.entries.map((entry) => (
              <DayEditor
                key={entry.date}
                entry={entry}
                active={activeDate === entry.date}
                holidayName={state.holidays.find((h) => h.date === entry.date)?.name}
                holidayType={state.holidays.find((h) => h.date === entry.date)?.type}
                onFocus={() => setActiveDate(entry.date)}
                onItemsChange={(items) => updateEntry(entry.date, { items })}
                onLabelChange={(label) => {
                  if (label) {
                    updateEntry(entry.date, { label });
                    return;
                  }

                  patch({
                    entries: draft.entries.map((currentEntry) => {
                      if (currentEntry.date !== entry.date) return currentEntry;
                      const { label: _label, ...entryWithoutLabel } = currentEntry;
                      return entryWithoutLabel;
                    }),
                  });
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <AppShell>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <ArrowLeft className="size-4" aria-hidden /> My Reports
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Input
            id="title"
            aria-label="Report title"
            value={draft.title}
            onChange={(e) => patch({ title: e.target.value })}
            className="h-9 w-[min(22rem,55vw)] min-w-40 border-transparent bg-transparent text-lg font-semibold tracking-tight shadow-none focus-visible:border-input focus-visible:bg-background"
          />
        </div>
        <div className="flex items-center gap-3">
          <SaveIndicator state={saveState} />
          <Select
            value={draft.status}
            onValueChange={(v) => patch({ status: v as Report["status"] })}
          >
            <SelectTrigger className="w-32" aria-label="Report status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Finalized">Finalized</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="gap-2"
            onClick={() => {
              toast.loading("Generating Word document…", { id: draft.id });
              void downloadWord({ report: draft, employee, office, holidays: state.holidays })
                .then(() =>
                  toast.success("Word file downloaded to your device.", {
                    id: draft.id,
                    description: `${formatPeriod(draft.periodStart, draft.periodEnd)} · ${office?.code ?? ""}`,
                  }),
                )
                .catch(() =>
                  toast.error("The Word file could not be generated.", { id: draft.id }),
                );
            }}
          >
            <Download className="size-4" aria-hidden /> Download Word
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-5xl">{editorPane}</div>
    </AppShell>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "saving")
    return (
      <span className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
        <Loader2 className="size-4 animate-spin" aria-hidden /> Saving…
      </span>
    );
  if (state === "failed")
    return (
      <span className="flex items-center gap-2 text-sm text-destructive" role="status">
        <AlertTriangle className="size-4" aria-hidden /> Save failed — retrying
      </span>
    );
  return (
    <span className="flex items-center gap-2 text-sm text-accent" role="status">
      <CircleCheck className="size-4" aria-hidden /> Saved
    </span>
  );
}

function DayEditor({
  entry,
  active,
  holidayName,
  holidayType,
  onFocus,
  onItemsChange,
  onLabelChange,
}: {
  entry: ReportEntry;
  active: boolean;
  holidayName?: string | undefined;
  holidayType?: string | undefined;
  onFocus: () => void;
  onItemsChange: (items: string[]) => void;
  onLabelChange: (label: ReportEntry["label"] | undefined) => void;
}) {
  const [value, setValue] = React.useState("");
  const [labelValue, setLabelValue] = React.useState(entry.label ?? "");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [showComposer, setShowComposer] = React.useState(false);
  const [showLabel, setShowLabel] = React.useState(Boolean(entry.label));
  const [open, setOpen] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const weekend = isWeekend(entry.date);

  React.useEffect(() => {
    setLabelValue(entry.label ?? "");
  }, [entry.label]);

  React.useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  function add() {
    const text = value.trim();
    if (!text) return;
    onItemsChange([...entry.items, text]);
    setValue("");
    setShowComposer(false);
  }

  function openComposer() {
    onFocus();
    setShowComposer(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function saveEdit(index: number, original: string) {
    const next = [...entry.items];
    next[index] = editValue.trim() || original;
    onItemsChange(next);
    setEditingIndex(null);
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...entry.items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    onItemsChange(next);
  }

  const collapsedItems = entry.items.slice(-2);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      id={`day-${entry.date}`}
      className={`group scroll-mt-6 grid grid-cols-[6.5rem_minmax(0,1fr)] overflow-hidden rounded-md border bg-card transition-colors sm:grid-cols-[8.5rem_minmax(0,1fr)] ${
        active ? "border-primary ring-1 ring-primary/30" : "border-border"
      }`}
    >
      <CollapsibleTrigger
        type="button"
        onClick={onFocus}
        aria-label={`${open ? "Collapse" : "Expand"} accomplishments for ${formatLongDate(entry.date)}`}
        className={`flex min-w-0 flex-col items-start gap-1.5 border-r border-border p-2.5 text-left sm:gap-2 sm:p-4 ${active ? "bg-accent/10" : "bg-muted/30"}`}
      >
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          {open ? (
            <ChevronDown className="size-3.5 shrink-0" aria-hidden />
          ) : (
            <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          )}
          <span className="truncate text-[11px] font-medium sm:text-xs">{dayName(entry.date)}</span>
        </div>
        <h3 className="whitespace-nowrap text-[11px] font-semibold leading-tight sm:text-sm">
          {formatShortDate(entry.date)}
        </h3>
        <span className="text-[10px] text-muted-foreground sm:text-xs">
          {entry.items.length} {entry.items.length === 1 ? "update" : "updates"}
        </span>
        {weekend && (
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            Weekend
          </Badge>
        )}
        {holidayName && (
          <Badge
            variant="outline"
            className="max-w-full whitespace-normal border-accent px-1.5 py-0 text-[10px] text-accent"
          >
            {holidayType} · {holidayName}
          </Badge>
        )}
      </CollapsibleTrigger>

      {!open && (
        <button
          type="button"
          className="flex min-w-0 items-center gap-3 p-2.5 text-left text-sm transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:p-4"
          onClick={() => {
            onFocus();
            setOpen(true);
          }}
          aria-label={`Expand accomplishments for ${formatLongDate(entry.date)}`}
        >
          {collapsedItems.length ? (
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {collapsedItems.map((item, index) => (
                <React.Fragment key={`${item}-${index}`}>
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-foreground/60" />
                  <span className="min-w-0 truncate">{item}</span>
                </React.Fragment>
              ))}
              {entry.items.length > collapsedItems.length && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  +{entry.items.length - collapsedItems.length} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">No accomplishments recorded</span>
          )}
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      )}

      <CollapsibleContent id={`day-content-${entry.date}`} className="min-w-0 p-2.5 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          {entry.label ? (
            <Badge variant="outline" className="max-w-[65%] truncate font-semibold">
              {entry.label}
            </Badge>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">Accomplishments</span>
          )}
          {entry.items.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 shrink-0 gap-1 px-2 text-xs"
              onClick={openComposer}
            >
              <Plus className="size-3.5" aria-hidden /> Add
            </Button>
          )}
        </div>

        {entry.items.length > 0 ? (
          <ul className="divide-y divide-border/70">
            {entry.items.map((item, i) => (
              <li
                key={i}
                className="group/item flex min-w-0 items-start gap-2 py-1.5 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden
                  className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-foreground/60"
                />
                {editingIndex === i ? (
                  <Input
                    autoFocus
                    value={editValue}
                    aria-label={`Edit accomplishment ${i + 1}`}
                    className="h-8 min-w-0 flex-1 text-sm"
                    onFocus={onFocus}
                    onChange={(event) => setEditValue(event.target.value)}
                    onBlur={() => saveEdit(i, item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") (event.target as HTMLInputElement).blur();
                      if (event.key === "Escape") {
                        setEditValue(item);
                        setEditingIndex(null);
                      }
                    }}
                  />
                ) : (
                  <span className="min-w-0 flex-1 whitespace-normal break-words text-sm leading-relaxed">
                    {item}
                  </span>
                )}
                {editingIndex !== i && (
                  <div className="flex shrink-0 items-center gap-0.5 opacity-80 transition-opacity group-hover/item:opacity-100 focus-within:opacity-100">
                    <MiniButton
                      label={`Edit accomplishment ${i + 1}`}
                      onClick={() => {
                        onFocus();
                        setEditingIndex(i);
                        setEditValue(item);
                      }}
                    >
                      <Pencil className="size-3.5" aria-hidden />
                    </MiniButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-foreground"
                          aria-label={`More actions for accomplishment ${i + 1}`}
                        >
                          <MoreHorizontal className="size-3.5" aria-hidden />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled={i === 0} onSelect={() => move(i, -1)}>
                          <ChevronUp aria-hidden /> Move up
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={i === entry.items.length - 1}
                          onSelect={() => move(i, 1)}
                        >
                          <ChevronDown aria-hidden /> Move down
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <MiniButton
                      label={`Delete accomplishment ${i + 1}`}
                      onClick={() => onItemsChange(entry.items.filter((_, index) => index !== i))}
                    >
                      <Trash2 className="size-3.5 text-destructive" aria-hidden />
                    </MiniButton>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-1 text-sm text-muted-foreground">
            No accomplishments recorded for this date.
          </p>
        )}

        {entry.items.length > 0 && !showComposer && (
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={openComposer}
            >
              <Plus className="size-3.5" aria-hidden /> Add
            </Button>
          </div>
        )}

        {showComposer && (
          <div className="mt-3 flex min-w-0 items-center gap-2">
            <Input
              ref={inputRef}
              value={value}
              placeholder={
                weekend || holidayName
                  ? "Add accomplishment (entries allowed on non-working days)"
                  : "Describe an accomplishment, then press Enter"
              }
              aria-label={`Add accomplishment for ${formatLongDate(entry.date)}`}
              onFocus={onFocus}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  add();
                }
              }}
            />
            <Button variant="outline" size="icon" aria-label="Add accomplishment" onClick={add}>
              <Plus className="size-4" aria-hidden />
            </Button>
            {entry.items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setShowComposer(false)}>
                Cancel
              </Button>
            )}
          </div>
        )}

        <div className="mt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
            onClick={() => setShowLabel((current) => !current)}
            aria-expanded={showLabel}
          >
            <Tag className="size-3.5" aria-hidden />
            {showLabel
              ? "Hide report label"
              : entry.label
                ? "Edit report label"
                : "Add report label"}
          </Button>

          {showLabel && (
            <div className="mt-2 flex max-w-md items-center gap-2">
              <Label
                htmlFor={`day-label-${entry.date}`}
                className="shrink-0 text-xs text-muted-foreground"
              >
                Report label
              </Label>
              <Input
                id={`day-label-${entry.date}`}
                value={labelValue}
                placeholder="Optional heading in the Word report"
                onFocus={onFocus}
                onChange={(event) => setLabelValue(event.target.value)}
                onBlur={() => onLabelChange(labelValue.trim() || undefined)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") (event.target as HTMLInputElement).blur();
                  if (event.key === "Escape") setLabelValue(entry.label ?? "");
                }}
                maxLength={40}
                className="h-8 text-xs"
              />
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function MiniButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:text-foreground"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

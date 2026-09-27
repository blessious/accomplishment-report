import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Boac LGU Accomplishment Report Maker" },
      {
        name: "description",
        content:
          "Update your name, position, office, default 'Noted by' signatory, and password for the Boac LGU report system.",
      },
      { property: "og:title", content: "My Profile — Boac LGU Report Maker" },
      {
        property: "og:description",
        content: "Manage your employee details and signatory defaults.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { currentUser, state, updateCurrentUser, changeCurrentPassword } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) navigate({ to: "/" });
  }, [currentUser, navigate]);

  const [form, setForm] = React.useState({
    fullName: currentUser?.fullName ?? "",
    nickname: currentUser?.nickname ?? "",
    position: currentUser?.position ?? "",
    officeId: currentUser?.officeId ?? "",
    notedByName: currentUser?.notedByName ?? "",
    notedByPosition: currentUser?.notedByPosition ?? "",
  });
  const [pw, setPw] = React.useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = React.useState<string | null>(null);

  if (!currentUser) return null;
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        These details appear on every accomplishment report you generate.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Employee information</CardTitle>
            <CardDescription>Username: {currentUser.username}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.fullName.trim() || !form.position.trim() || !form.officeId) {
                  toast.error("Name, position, and office are required.");
                  return;
                }
                updateCurrentUser(form);
                toast.success("Profile updated.");
              }}
            >
              <Field
                id="p-name"
                label="Full name"
                value={form.fullName}
                onChange={set("fullName")}
              />
              <div>
                <Field
                  id="p-nickname"
                  label="Nickname"
                  value={form.nickname}
                  onChange={set("nickname")}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Used only for your dashboard greeting. Leave blank if you prefer no name there.
                </p>
              </div>
              <Field
                id="p-position"
                label="Position / Designation"
                value={form.position}
                onChange={set("position")}
              />
              <div className="space-y-2">
                <Label htmlFor="p-office">Office</Label>
                <Select value={form.officeId} onValueChange={set("officeId")}>
                  <SelectTrigger id="p-office">
                    <SelectValue placeholder="Select office" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.offices
                      .filter((office) => office.active)
                      .map((office) => (
                        <SelectItem key={office.id} value={office.id}>
                          {office.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Field
                id="p-noted-name"
                label="Default 'Noted by' name"
                value={form.notedByName}
                onChange={set("notedByName")}
              />
              <Field
                id="p-noted-pos"
                label="Default 'Noted by' position"
                value={form.notedByPosition}
                onChange={set("notedByPosition")}
              />
              <Button type="submit">Save changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Change password</CardTitle>
            <CardDescription>Use at least 6 characters.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (pw.next.length < 8)
                  return setPwError("New password must be at least 8 characters.");
                if (pw.next !== pw.confirm) return setPwError("New passwords do not match.");
                const result = await changeCurrentPassword(pw.current, pw.next);
                if (!result.ok) return setPwError(result.error ?? "Password change failed.");
                setPw({ current: "", next: "", confirm: "" });
                setPwError(null);
                toast.success("Password changed.");
              }}
            >
              <Field
                id="pw-current"
                label="Current password"
                type="password"
                value={pw.current}
                onChange={(v) => setPw((p) => ({ ...p, current: v }))}
              />
              <Field
                id="pw-next"
                label="New password"
                type="password"
                value={pw.next}
                onChange={(v) => setPw((p) => ({ ...p, next: v }))}
              />
              <Field
                id="pw-confirm"
                label="Confirm new password"
                type="password"
                value={pw.confirm}
                onChange={(v) => setPw((p) => ({ ...p, confirm: v }))}
              />
              {pwError && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {pwError}
                </p>
              )}
              <Button type="submit" variant="outline">
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

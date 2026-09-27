import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/change-password")({
  head: () => ({ meta: [{ title: "Change password — Boac LGU Report Maker" }] }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { currentUser, loading, changeCurrentPassword, logout } = useStore();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [nextPassword, setNextPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      void navigate({ to: "/", replace: true });
      return;
    }
    if (!currentUser.mustChangePassword) {
      void navigate({ to: currentUser.role === "admin" ? "/admin" : "/dashboard", replace: true });
    }
  }, [currentUser, loading, navigate]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (nextPassword.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }
    setSaving(true);
    const result = await changeCurrentPassword(currentPassword, nextPassword);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "Password change failed.");
      return;
    }
    toast.success("Password changed. You can now continue.");
    if (currentUser) {
      void navigate({ to: currentUser.role === "admin" ? "/admin" : "/dashboard", replace: true });
    }
  }

  if (loading || !currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground">Loading your account…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-sm font-medium text-primary">Municipality of Boac</p>
          <CardTitle>Change your temporary password</CardTitle>
          <CardDescription>
            For account security, set a new password before continuing as {currentUser.fullName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(event) => void submit(event)}>
            <div className="space-y-2">
              <Label htmlFor="temporary-password">Temporary or current password</Label>
              <Input
                id="temporary-password"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={nextPassword}
                onChange={(event) => setNextPassword(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  logout();
                  void navigate({ to: "/", replace: true });
                }}
              >
                Sign out
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Updating…" : "Set new password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

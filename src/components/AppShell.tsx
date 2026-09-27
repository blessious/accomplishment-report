import * as React from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { FileText, LogOut, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, officeOf, logout } = useStore();
  const navigate = useNavigate();
  const router = useRouter();
  const path = router.state.location.pathname;

  React.useEffect(() => {
    if (currentUser?.mustChangePassword && path !== "/change-password") {
      void navigate({ to: "/change-password", replace: true });
    }
  }, [currentUser, navigate, path]);

  if (!currentUser) return <>{children}</>;
  if (currentUser.mustChangePassword && path !== "/change-password") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground">Opening the required password change…</p>
      </main>
    );
  }

  const office = officeOf(currentUser.officeId);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/15 bg-primary text-primary-foreground shadow-[0_4px_24px_rgb(30_41_90/18%)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3.5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Municipality of Boac seal"
              className="size-10 object-contain"
            />
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-wide">
                LGU Accomplishment Report Maker
              </span>
              <span className="block text-xs text-primary-foreground/70">
                Municipality of Boac · Province of Marinduque
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="ml-auto flex items-center gap-1">
            <NavLink
              to="/dashboard"
              active={path.startsWith("/dashboard") || path.startsWith("/report")}
            >
              <FileText className="size-4" aria-hidden /> My Reports
            </NavLink>
            {currentUser.role === "admin" && (
              <NavLink to="/admin" active={path.startsWith("/admin")}>
                <ShieldCheck className="size-4" aria-hidden /> Administration
              </NavLink>
            )}
            <NavLink to="/profile" active={path.startsWith("/profile")}>
              <User className="size-4" aria-hidden /> Profile
            </NavLink>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2" aria-label="Account menu">
                <span className="max-w-[13rem] truncate">{currentUser.fullName}</span>
                <Badge variant={currentUser.role === "admin" ? "default" : "outline"}>
                  {currentUser.role === "admin" ? "Administrator" : "Employee"}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-normal">
                <span className="block font-semibold">{currentUser.fullName}</span>
                <span className="block text-xs text-muted-foreground">
                  {currentUser.position} · {office?.code}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="size-4" aria-hidden /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">{children}</main>
    </div>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary-foreground/15 text-primary-foreground"
          : "text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

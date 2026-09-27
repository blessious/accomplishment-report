import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
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
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — LGU Accomplishment Report Maker | Boac, Marinduque" },
      {
        name: "description",
        content:
          "Sign in to the official accomplishment report system for employees of the Municipality of Boac, Province of Marinduque.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { state, loading, currentUser, login, register } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("login");
  const goHome = (role: string) => navigate({ to: role === "admin" ? "/admin" : "/dashboard" });

  React.useEffect(() => {
    if (loading || !currentUser) return;
    if (currentUser.mustChangePassword) {
      void navigate({ to: "/change-password", replace: true });
      return;
    }
    void navigate({ to: currentUser.role === "admin" ? "/admin" : "/dashboard", replace: true });
  }, [currentUser, loading, navigate]);
  return (
    <main className="simple-auth-page flex min-h-screen items-start justify-center px-5 py-8 sm:items-center sm:py-5">
      <BubbleBackground />
      <section
        className="simple-auth-card relative w-full max-w-[27rem] rounded-2xl bg-white p-7 sm:p-10"
        aria-labelledby="sign-in-heading"
      >
        <header className="mb-8">
          <img
            src="/logo.png"
            alt="Municipality of Boac seal"
            className="simple-auth-brand mb-7 size-12 object-contain"
          />
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">
            Accomplishment Report Maker
          </p>
          <h1
            key={activeTab}
            id="sign-in-heading"
            className="simple-auth-heading text-3xl font-semibold tracking-tight text-slate-900"
          >
            {activeTab === "login" ? "Sign in" : "Register"}
          </h1>
        </header>
        <div className="simple-auth-toggle mb-7" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "login"}
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "register"}
            className={activeTab === "register" ? "active" : ""}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>
        <div
          key={activeTab}
          className={`simple-auth-content ${activeTab === "login" ? "slide-from-left" : "slide-from-right"}`}
        >
          {activeTab === "login" ? (
            <LoginForm
              onSubmit={async (u, p) => {
                const res = await login(u, p);
                if (!res.ok) return res.error ?? "Sign in failed.";
                toast.success(`Welcome, ${res.name ?? u}`);
                goHome(res.role ?? "employee");
                return null;
              }}
            />
          ) : (
            <RegisterForm
              offices={state.offices.filter((office) => office.active)}
              officesLoading={loading}
              onSubmit={async (data) => {
                const res = await register(data);
                if (!res.ok) return res.error ?? "Registration failed.";
                toast.success("Account created. Welcome aboard!");
                goHome("employee");
                return null;
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function BubbleBackground() {
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--pointer-x",
      `${(event.clientX - rect.left - rect.width / 2) * 0.025}px`,
    );
    event.currentTarget.style.setProperty(
      "--pointer-y",
      `${(event.clientY - rect.top - rect.height / 2) * 0.025}px`,
    );
  };
  const bubbles = [
    { size: 390, left: "-8%", top: "-18%", color: "#8cb8ff", delay: "-4s", duration: "18s" },
    { size: 300, left: "78%", top: "-10%", color: "#b8a2ff", delay: "-11s", duration: "21s" },
    { size: 250, left: "84%", top: "65%", color: "#8fe0e1", delay: "-7s", duration: "17s" },
    { size: 320, left: "-12%", top: "72%", color: "#b6d2ff", delay: "-14s", duration: "22s" },
    { size: 180, left: "48%", top: "-16%", color: "#d5c6ff", delay: "-2s", duration: "16s" },
    { size: 160, left: "42%", top: "80%", color: "#a8d8ff", delay: "-9s", duration: "20s" },
  ];
  return (
    <div className="bubble-background" aria-hidden="true" onPointerMove={handlePointerMove}>
      {bubbles.map((bubble, index) => (
        <span
          key={index}
          className="bubble"
          style={
            {
              "--bubble-size": `${bubble.size}px`,
              "--bubble-left": bubble.left,
              "--bubble-top": bubble.top,
              "--bubble-color": bubble.color,
              "--bubble-delay": bubble.delay,
              "--bubble-duration": bubble.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

type Registration = {
  username: string;
  password: string;
  fullName: string;
  nickname: string;
  position: string;
  officeId: string;
  notedByName: string;
  notedByPosition: string;
};
function RegisterForm({
  offices,
  officesLoading,
  onSubmit,
}: {
  offices: { id: string; code: string; name: string }[];
  officesLoading: boolean;
  onSubmit: (data: Registration) => Promise<string | null>;
}) {
  const [form, setForm] = React.useState<Registration>({
    username: "",
    password: "",
    fullName: "",
    nickname: "",
    position: "",
    officeId: "",
    notedByName: "JACOB M. MONTEVIRGEN, ECE",
    notedByPosition: "IT Officer I",
  });
  const [error, setError] = React.useState<string | null>(null);
  const set = (key: keyof Registration) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  React.useEffect(() => {
    if (!form.officeId && offices[0]) {
      const defaultOffice = offices.find((office) => office.code === "MAYOR") ?? offices[0];
      setForm((current) => ({ ...current, officeId: defaultOffice.id }));
    }
  }, [form.officeId, offices]);
  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (form.fullName.trim().length < 3) return setError("Enter your full name.");
        if (!form.nickname.trim()) return setError("Enter the name you would like us to use.");
        if (form.username.trim().length < 4)
          return setError("Username must be at least 4 characters.");
        if (form.password.length < 6) return setError("Password must be at least 6 characters.");
        if (!form.position.trim()) return setError("Position / designation is required.");
        if (!form.officeId) return setError("Select your office.");
        if (!form.notedByName.trim()) return setError("Default 'Noted by' name is required.");
        if (!form.notedByPosition.trim())
          return setError("Default 'Noted by' position is required.");
        setError(await onSubmit(form));
      }}
    >
      <Field
        id="reg-name"
        label="Full name"
        value={form.fullName}
        onChange={set("fullName")}
        placeholder="Juan D. Dela Cruz"
      />
      <Field
        id="reg-nickname"
        label="Nickname"
        value={form.nickname}
        onChange={set("nickname")}
        placeholder="Juan"
      />
      <Field
        id="reg-username"
        label="Username"
        value={form.username}
        onChange={set("username")}
        placeholder="jdelacruz"
      />
      <PasswordField
        id="reg-password"
        label="Password"
        value={form.password}
        onChange={set("password")}
        autoComplete="new-password"
      />
      <Field
        id="reg-position"
        label="Position / Designation"
        value={form.position}
        onChange={set("position")}
        placeholder="Administrative Aide VI"
      />
      <div className="space-y-2">
        <Label className="simple-auth-label" htmlFor="reg-office">
          Office
        </Label>
        <Select
          value={form.officeId}
          onValueChange={set("officeId")}
          disabled={officesLoading || offices.length === 0}
        >
          <SelectTrigger id="reg-office" className="simple-auth-input w-full">
            <SelectValue placeholder={officesLoading ? "Loading offices…" : "Select office"} />
          </SelectTrigger>
          <SelectContent>
            {offices.map((office) => (
              <SelectItem key={office.id} value={office.id}>
                {office.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!officesLoading && offices.length === 0 && (
          <p role="alert" className="text-xs font-medium text-destructive">
            Offices could not be loaded. Please refresh the page.
          </p>
        )}
      </div>
      <Field
        id="reg-noted-name"
        label="Default 'Noted by' name"
        value={form.notedByName}
        onChange={set("notedByName")}
        placeholder="JACOB M. MONTEVIRGEN, ECE"
      />
      <Field
        id="reg-noted-position"
        label="Default 'Noted by' position"
        value={form.notedByPosition}
        onChange={set("notedByPosition")}
        placeholder="IT Officer I"
      />
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" className="simple-auth-submit w-full">
        Create account
      </Button>
    </form>
  );
}
function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="simple-auth-label" htmlFor={id}>
        {label}
      </Label>
      <Input
        className="simple-auth-input"
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="space-y-2">
      <Label className="simple-auth-label" htmlFor={id}>
        {label}
      </Label>
      <div className="relative">
        <Input
          className="simple-auth-input pr-10"
          id={id}
          type={show ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-[#173c5e]"
        >
          {show ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
function LoginForm({ onSubmit }: { onSubmit: (u: string, p: string) => Promise<string | null> }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!username.trim()) return setError("Username is required.");
        if (password.length < 6) return setError("Password must be at least 6 characters.");
        setError(await onSubmit(username, password));
      }}
    >
      <Field
        id="login-username"
        label="Username"
        value={username}
        placeholder="Enter your username"
        onChange={setUsername}
      />
      <PasswordField
        id="login-password"
        label="Password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" className="simple-auth-submit w-full">
        Sign in
      </Button>
    </form>
  );
}

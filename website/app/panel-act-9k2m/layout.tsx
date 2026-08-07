"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import "./admin.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) setError("Invalid email or password.");
  }

  return (
    <div className="admin-root flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="admin-card p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-[var(--a-text)] mb-1">Admin panel</h1>
        <p className="admin-label mb-6">All Custom Trailers</p>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-input w-full"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input w-full"
          />
          {error && <p className="text-sm text-[var(--a-danger)]">{error}</p>}
          <button type="submit" disabled={loading} className="admin-btn-primary mt-2">
            {loading ? "..." : "Log in"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<unknown>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!checked) return null;
  if (!session) return <LoginForm />;

  return (
    <div className="admin-root">
      <header className="border-b border-[var(--a-border)] bg-[var(--a-surface)] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/panel-act-9k2m">
            <p className="text-base font-semibold text-[var(--a-text)]">All Custom Trailers</p>
            <p className="admin-label">Admin</p>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/panel-act-9k2m/quotes" className="admin-btn-secondary">
              Aceptadas
            </Link>
            <Link href="/panel-act-9k2m/catalog" className="admin-btn-secondary">
              Catálogo
            </Link>
            <button onClick={handleLogout} className="admin-btn-secondary">
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

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
    <div className="min-h-screen flex items-center justify-center blueprint-bg px-6">
      <form onSubmit={handleSubmit} className="stacked-card p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-[var(--text)] mb-1">
          Admin panel
        </h1>
        <p className="font-mono text-xs text-[var(--text-muted)] mb-6">All Custom Trailers</p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--surface-2)] border-0 border-b-2 border-[var(--line)] rounded-t text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-2)]"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--surface-2)] border-0 border-b-2 border-[var(--line)] rounded-t text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-2)]"
          />
          {error && <p className="text-sm text-[var(--accent-2)]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-3.5 bg-[var(--accent-2)] text-white font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-60"
          >
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
    <div className="min-h-screen blueprint-bg">
      <header className="border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/panel-act-9k2m">
            <p className="font-display text-lg font-semibold text-[var(--text)]">
              All Custom Trailers
            </p>
            <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wide">
              Admin
            </p>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/panel-act-9k2m/catalog"
              className="px-4 py-2 text-xs font-mono border border-[var(--line)] rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent-2)] transition-colors"
            >
              Catálogo
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-mono border border-[var(--line)] rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent-2)] transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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

    if (signInError) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center blueprint-bg px-6">
      <form onSubmit={handleSubmit} className="stacked-card p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-[#f2ece2] mb-1">
          Admin panel
        </h1>
        <p className="font-mono text-xs text-[#8f8477] mb-6">All Custom Trailers</p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#2b241d] border-0 border-b-2 border-[#f2ece2]/12 rounded-t text-sm text-[#f2ece2] focus:outline-none focus:border-[#b8562f]"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#2b241d] border-0 border-b-2 border-[#f2ece2]/12 rounded-t text-sm text-[#f2ece2] focus:outline-none focus:border-[#b8562f]"
          />

          {error && <p className="text-sm text-[#e63946]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-3.5 bg-[#b8562f] text-white font-semibold rounded hover:bg-[#e8794a] transition-colors disabled:opacity-60"
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
  const router = useRouter();
  const pathname = usePathname();
  const isRoot = pathname === "/panel-act-9k2m";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!checked) return null;
  if (!session) return <LoginForm />;

  return (
    <div className="min-h-screen blueprint-bg">
      <header className="border-b border-[#f2ece2]/8 bg-[#16130f]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/panel-act-9k2m" className="flex items-center gap-3">
            {!isRoot && (
              <span className="font-mono text-xs text-[#8f8477]">← Pipeline</span>
            )}
            <div>
              <p className="font-display text-lg font-semibold text-[#f2ece2]">
                All Custom Trailers
              </p>
              <p className="font-mono text-[10px] text-[#8f8477] uppercase tracking-wide">
                Admin
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-mono border border-[#f2ece2]/15 rounded text-[#8f8477] hover:text-[#f2ece2] hover:border-[#f2ece2]/30 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
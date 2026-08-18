"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const CUSTOM_VALUE = "Custom / Other";
const IDEA_KEY = "__allCustomTrailerIdea";

function setIdea(value: string) {
  if (typeof window === "undefined") return;
  (window as typeof window & { [IDEA_KEY]?: string })[IDEA_KEY] = value;
}

export default function LeadIdeaEnhancer() {
  const [select, setSelect] = useState<HTMLSelectElement | null>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [idea, setIdeaState] = useState("");

  useEffect(() => {
    const findForm = () => {
      const contactForm = document.querySelector<HTMLFormElement>("#contact form");
      const nextSelect = contactForm?.querySelector<HTMLSelectElement>("select");
      if (!nextSelect) return;

      if (select !== nextSelect) {
        if (host && !host.isConnected) {
          setHost(null);
        }
        setSelect(nextSelect);
      }

      if (!nextSelect.parentElement) return;
      let nextHost = nextSelect.parentElement.querySelector<HTMLDivElement>("[data-lead-idea-host]");
      if (!nextHost) {
        nextHost = document.createElement("div");
        nextHost.setAttribute("data-lead-idea-host", "true");
        nextSelect.parentElement.insertAdjacentElement("afterend", nextHost);
      }
      if (nextHost !== host) setHost(nextHost);

      const isCustom = nextSelect.value === CUSTOM_VALUE;
      setVisible(isCustom);
    };

    findForm();
    const observer = new MutationObserver(findForm);
    observer.observe(document.body, { childList: true, subtree: true });
    const interval = window.setInterval(findForm, 500);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, [host, select]);

  useEffect(() => {
    if (!select) return;
    const handleChange = () => {
      const isCustom = select.value === CUSTOM_VALUE;
      setVisible(isCustom);
      if (!isCustom) {
        setIdeaState("");
        setIdea("");
      }
    };
    select.addEventListener("change", handleChange);
    handleChange();
    return () => select.removeEventListener("change", handleChange);
  }, [select]);

  useEffect(() => {
    setIdea(idea);
  }, [idea]);

  if (!host || !visible) return null;

  return createPortal(
    <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-4">
      <label htmlFor="lead-custom-idea" className="block font-mono text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
        Tell us a little about your idea
      </label>
      <textarea
        id="lead-custom-idea"
        value={idea}
        onChange={(event) => setIdeaState(event.target.value)}
        rows={3}
        maxLength={500}
        placeholder="A few words are enough."
        className="w-full resize-none rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
      />
      <p className="mt-2 text-xs text-[var(--text-muted)]">Optional — not sure yet? That&apos;s okay. We&apos;ll help you figure it out.</p>
      <a href="tel:+17754096847" className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent-2)] hover:text-[var(--accent)]">
        Prefer to talk? Call (775) 409-6847 →
      </a>
    </div>,
    host,
  );
}

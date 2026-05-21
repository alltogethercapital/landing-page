"use client";

import { useState } from "react";
import { ArrowUpRight } from "@/components/icons";

type Status = "idle" | "loading" | "success" | "error";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setMessage("Thanks — you're on the list.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-5 text-[14px] leading-relaxed text-white/70">{message}</p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5" noValidate>
      <div className="flex items-center justify-between gap-3 border border-white/15 py-2 pl-4 pr-2 transition-colors focus-within:border-[#ff4400]/60">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email address"
          autoComplete="email"
          className="w-full bg-transparent text-[14px] text-white placeholder:text-white/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
          className="flex size-8 shrink-0 items-center justify-center bg-[#ff4400] text-black transition-transform hover:scale-105 disabled:opacity-60"
        >
          <ArrowUpRight className="size-4" />
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-[13px] text-[#ff4400]">{message}</p>
      )}
    </form>
  );
}

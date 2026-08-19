"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import "./auth.css";

type User = { name: string; email: string; passwordHash: string; role: "SUPER_ADMIN" | "MEMBER" };
const storageKey = "messmate_users";

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map(value => value.toString(16).padStart(2, "0")).join("");
}

function readUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(storageKey) || "[]") as User[]; } catch { return []; }
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    if (isSignup) {
      if (password.length < 8) { setMessage("Password must be at least 8 characters."); setBusy(false); return; }
      if (users.some(user => user.email === normalizedEmail)) { setMessage("An account with this email already exists."); setBusy(false); return; }
      const role = users.length === 0 ? "SUPER_ADMIN" : "MEMBER";
      const user: User = { name: name.trim(), email: normalizedEmail, passwordHash, role };
      localStorage.setItem(storageKey, JSON.stringify([...users, user]));
      localStorage.setItem("messmate_session", JSON.stringify({ name: user.name, email: user.email, role: user.role }));
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`;
    } else {
      const user = users.find(candidate => candidate.email === normalizedEmail && candidate.passwordHash === passwordHash);
      if (!user) { setMessage("Email or password is incorrect."); setBusy(false); return; }
      localStorage.setItem("messmate_session", JSON.stringify({ name: user.name, email: user.email, role: user.role }));
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`;
    }
  }

  return <main className="auth-page"><section className="auth-art"><div className="auth-brand"><span className="brand-mark">M</span><strong>Messmate</strong></div><div className="auth-art-copy"><div className="eyebrow">HOUSE 08 / MANAGEMENT</div><h1>Keep the house<br /><em>in balance.</em></h1><p>One clear place for meals, members, money, and the everyday rhythm of your mess.</p><div className="auth-stats"><div><strong>24</strong><span>active members</span></div><div><strong>৳48k</strong><span>collected this month</span></div></div></div></section><section className="auth-panel"><div className="auth-panel-inner"><div className="auth-kicker">{isSignup ? "CREATE YOUR WORKSPACE" : "WELCOME BACK"}</div><h2>{isSignup ? "Start your mess" : "Sign in to Messmate"}</h2><p className="auth-subtitle">{isSignup ? "The first account becomes Super Admin automatically." : "Your house is waiting for you."}</p><form onSubmit={submit}>{isSignup && <label>Full name<input value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Farhan Ahmed" required /></label>}<label>Email address<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required /></label>{message && <div className="auth-message">{message}</div>}<button className="auth-submit" disabled={busy}>{busy ? "Please wait..." : isSignup ? "Create account →" : "Sign in →"}</button></form><div className="auth-switch">{isSignup ? "Already have an account?" : "New to Messmate?"} <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</Link></div><div className="auth-note">Demo authentication for the static GitHub Pages build. Production accounts require a server database and secure sessions.</div></div></section></main>;
}

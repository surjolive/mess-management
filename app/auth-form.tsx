"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import "./auth.css";

type User = { name: string; email: string; passwordHash: string; role: "SUPER_ADMIN" | "MEMBER"; verified: boolean };
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
  const [step, setStep] = useState<"details" | "verify">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function sendCode(user: User) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingUser(user);
    setSentCode(verificationCode);
    setStep("verify");
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (isSignup && step === "details") {
      if (password.length < 8) { setMessage("Password must be at least 8 characters."); setBusy(false); return; }
      if (users.some(user => user.email === normalizedEmail)) { setMessage("An account with this email already exists."); setBusy(false); return; }
      const passwordHash = await hashPassword(password);
      const role = users.length === 0 ? "SUPER_ADMIN" : "MEMBER";
      sendCode({ name: name.trim(), email: normalizedEmail, passwordHash, role, verified: false });
      setBusy(false);
      return;
    }
    if (isSignup && step === "verify") {
      if (code.trim() !== sentCode) { setMessage("That verification code is not correct."); setBusy(false); return; }
      if (!pendingUser) { setMessage("Verification expired. Please start again."); setBusy(false); return; }
      const verifiedUser = { ...pendingUser, verified: true };
      localStorage.setItem(storageKey, JSON.stringify([...users, verifiedUser]));
      localStorage.setItem("messmate_session", JSON.stringify({ name: verifiedUser.name, email: verifiedUser.email, role: verifiedUser.role }));
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`;
      return;
    }
    const passwordHash = await hashPassword(password);
    const user = users.find(candidate => candidate.email === normalizedEmail && candidate.passwordHash === passwordHash);
    if (!user) { setMessage("Email or password is incorrect."); setBusy(false); return; }
    if (!user.verified) { sendCode(user); setBusy(false); return; }
    localStorage.setItem("messmate_session", JSON.stringify({ name: user.name, email: user.email, role: user.role }));
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`;
  }

  const verificationStep = isSignup && step === "verify";
  return <main className="auth-page"><section className="auth-art"><div className="auth-brand"><span className="brand-mark">M</span><strong>Messmate</strong></div><div className="auth-art-copy"><div className="eyebrow">HOUSE 08 / MANAGEMENT</div><h1>Keep the house<br /><em>in balance.</em></h1><p>One clear place for meals, members, money, and the everyday rhythm of your mess.</p><div className="auth-stats"><div><strong>24</strong><span>active members</span></div><div><strong>৳48k</strong><span>collected this month</span></div></div></div></section><section className="auth-panel"><div className="auth-panel-inner"><div className="auth-kicker">{verificationStep ? "CHECK YOUR EMAIL" : isSignup ? "CREATE YOUR WORKSPACE" : "WELCOME BACK"}</div><h2>{verificationStep ? "Verify your email" : isSignup ? "Start your mess" : "Sign in to Messmate"}</h2><p className="auth-subtitle">{verificationStep ? `Enter the 6-digit code sent to ${email}.` : isSignup ? "The first verified account becomes Super Admin automatically." : "Your house is waiting for you."}</p><form onSubmit={submit}>{verificationStep ? <><label>Verification code<input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value)} placeholder="000000" required /></label><div className="demo-code">Demo email code: <strong>{sentCode}</strong><small>Static GitHub Pages preview only</small></div></> : <>{isSignup && <label>Full name<input value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Farhan Ahmed" required /></label>}<label>Email address<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required /></label></>}{message && <div className="auth-message">{message}</div>}<button className="auth-submit" disabled={busy}>{busy ? "Please wait..." : verificationStep ? "Verify & continue →" : isSignup ? "Send verification code →" : "Sign in →"}</button></form>{verificationStep && <button className="resend" onClick={() => pendingUser && sendCode(pendingUser)}>Resend code</button>}<div className="auth-switch">{verificationStep ? "Wrong email?" : isSignup ? "Already have an account?" : "New to Messmate?"} <Link href={verificationStep ? "/signup" : isSignup ? "/login" : "/signup"}>{verificationStep ? "Start again" : isSignup ? "Sign in" : "Create an account"}</Link></div><div className="auth-note">Email verification is a static demo preview. Production delivery needs a backend email provider and server-side sessions.</div></div></section></main>;
}

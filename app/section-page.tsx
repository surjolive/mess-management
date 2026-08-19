"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./section.css";

type Row = { name: string; detail: string; value: string; status: string };
type SectionPageProps = { title: string; eyebrow: string; description: string; icon: string; stats: [string, string, string][]; rows: Row[]; action: string };

const navigation = [["Overview", "⌂", "/dashboard/"], ["Members", "♙", "/members/"], ["Rooms & seats", "▦", "/rooms/"], ["Meals", "◒", "/meals/"], ["Bazar", "◈", "/bazar/"], ["Payments", "৳", "/payments/"], ["Expenses", "↗", "/expenses/"], ["Reports", "▤", "/reports/"]];

export default function SectionPage({ title, eyebrow, description, icon, stats, rows, action }: SectionPageProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.localStorage.getItem("messmate_session")) window.setTimeout(() => setReady(true), 0);
    else window.location.replace(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/login/`);
  }, []);
  if (!ready) return <div className="auth-loading">Checking your session...</div>;
  return <div className="shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">M</div><div><strong>Messmate</strong><span>HOUSE 08</span></div></div><div className="workspace-label">WORKSPACE</div><nav>{navigation.map(([label, navIcon, href]) => <Link key={label} href={href} className={label === title ? "nav-item active" : "nav-item"}><span>{navIcon}</span>{label}{label === "Payments" && <b>3</b>}</Link>)}</nav><div className="sidebar-bottom"><Link href="/dashboard/" className="nav-item"><span>⚙</span>Settings</Link><div className="upgrade"><div className="spark">✦</div><strong>Everything in order.</strong><p>Your house is running smoothly this month.</p></div><div className="profile"><div className="avatar avatar-purple">FA</div><div><strong>Farhan Ahmed</strong><span>Administrator</span></div><Link className="dots" href="/login/">↪</Link></div></div></aside><main className="content"><header className="topbar"><button className="mobile-menu">☰</button><div className="breadcrumb"><span>Messmate</span><i>/</i><strong>{title}</strong></div><div className="top-actions"><button className="icon-btn">⌕</button><button className="icon-btn bell">♢<em></em></button><div className="date-pill">August 2026 <span>⌄</span></div></div></header><section className="section-heading"><div><div className="section-icon">{icon}</div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><button className="primary-btn"><span>＋</span> {action}</button></section><section className="section-stat-grid">{stats.map(([label, value, note]) => <div className="section-stat" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</section><section className="section-panel"><div className="panel-heading"><div><h2>{title} records</h2><p>Updated for August 2026</p></div><div className="section-tools"><input placeholder="Search records"/><button>Filter ⌄</button></div></div><div className="table-wrap"><table><thead><tr><th>RECORD</th><th>DETAIL</th><th>AMOUNT / COUNT</th><th>STATUS</th></tr></thead><tbody>{rows.map(row => <tr key={row.name}><td><div className="member-cell"><span className="avatar avatar-green">{row.name.slice(0, 2).toUpperCase()}</span><strong>{row.name}</strong></div></td><td>{row.detail}</td><td className="section-value">{row.value}</td><td><span className={`status ${row.status === "Paid" || row.status === "Active" ? "status-paid" : "status-pending"}`}>{row.status}</span></td></tr>)}</tbody></table></div></section></main></div>;
}

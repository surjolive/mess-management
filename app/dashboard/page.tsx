"use client";

import { useEffect, useState } from "react";

const navigation = [
  ["Overview", "⌂"], ["Members", "♙"], ["Rooms & seats", "▦"], ["Meals", "◒"],
  ["Bazar", "◈"], ["Payments", "৳"], ["Expenses", "↗"], ["Reports", "▤"],
];
const members = [
  { name: "Arif Hasan", room: "R-203 / B", meals: 42, due: 0, tone: "green", initials: "AH" },
  { name: "Nusrat Jahan", room: "R-101 / A", meals: 38, due: 1250, tone: "amber", initials: "NJ" },
  { name: "Sajid Rahman", room: "R-203 / A", meals: 44, due: 800, tone: "blue", initials: "SR" },
  { name: "Mahi Chowdhury", room: "R-101 / C", meals: 36, due: 0, tone: "rose", initials: "MC" },
];
const bars = [48, 66, 44, 72, 58, 82, 69, 92, 75, 87, 63, 78];
function money(amount: number) { return `৳${amount.toLocaleString("en-BD")}`; }

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    try {
      const session = window.localStorage.getItem("messmate_session");
      if (session) window.setTimeout(() => setAuthenticated(true), 0);
      else window.location.replace(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/login/`);
    } catch {
      window.location.replace(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/login/`);
    } finally {
      window.setTimeout(() => setCheckingSession(false), 0);
    }
  }, []);

  function signOut() {
    window.localStorage.removeItem("messmate_session");
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/login/`;
  }
  function quickAction(label: string) {
    if (label === "Add member") setShowMemberForm(true);
    else { setShowToast(true); window.setTimeout(() => setShowToast(false), 2600); }
  }
  if (checkingSession || !authenticated) return <div className="auth-loading">Checking your session...</div>;

  return (
    <div className="shell">
      <aside className="sidebar"><div className="brand"><div className="brand-mark">M</div><div><strong>Messmate</strong><span>HOUSE 08</span></div></div><div className="workspace-label">WORKSPACE</div><nav>{navigation.map(([label, icon]) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => setActive(label)}><span>{icon}</span>{label}{label === "Payments" && <b>3</b>}</button>)}</nav><div className="sidebar-bottom"><button className="nav-item"><span>⚙</span>Settings</button><div className="upgrade"><div className="spark">✦</div><strong>Everything in order.</strong><p>Your house is running smoothly this month.</p></div><div className="profile"><div className="avatar avatar-purple">FA</div><div><strong>Farhan Ahmed</strong><span>Administrator</span></div><button className="dots" onClick={signOut} title="Sign out">↪</button></div></div></aside>
      <main className="content"><header className="topbar"><button className="mobile-menu">☰</button><div className="breadcrumb"><span>Messmate</span><i>/</i><strong>{active}</strong></div><div className="top-actions"><button className="icon-btn">⌕</button><button className="icon-btn bell">♢<em></em></button><div className="date-pill">August 2026 <span>⌄</span></div></div></header><section className="page-heading"><div><div className="eyebrow">WEDNESDAY, AUGUST 19, 2026</div><h1>Good morning, Farhan <span>✦</span></h1><p>Here&apos;s what&apos;s happening at your mess today.</p></div><button className="primary-btn" onClick={() => quickAction("Add member")}><span>＋</span> Add member</button></section>
        <section className="stat-grid"><div className="stat-card stat-green"><div className="stat-top"><span>COLLECTION</span><span className="trend">↗ 12.8%</span></div><strong>{money(48650)}</strong><p>of {money(62000)} expected</p><div className="progress"><i style={{ width: "78%" }} /></div></div><div className="stat-card"><div className="stat-top"><span>ACTIVE MEMBERS</span><span className="stat-icon">♙</span></div><strong>24 <small>/ 28</small></strong><p>4 seats available</p><div className="mini-avatars"><span>AH</span><span>NJ</span><span>SR</span><span>+21</span></div></div><div className="stat-card"><div className="stat-top"><span>MEALS THIS MONTH</span><span className="stat-icon yellow">◒</span></div><strong>942 <small>meals</small></strong><p>Meal rate <b>৳52.10</b></p><div className="sparkline">▁▃▂▅▃▆▅▇▆▇</div></div><div className="stat-card stat-coral"><div className="stat-top"><span>TOTAL DUE</span><span className="trend coral">8 members</span></div><strong>{money(13350)}</strong><p>Needs attention this week</p><div className="due-dots"><i/><i/><i/><i/><i/><i/><i/><i/></div></div></section>
        <section className="dashboard-grid"><div className="panel chart-panel"><div className="panel-heading"><div><h2>Cash flow</h2><p>Income and expenses over the last 12 months</p></div><div className="legend"><span className="income-dot"/>Income <span className="expense-dot"/>Expenses <button>Monthly ⌄</button></div></div><div className="chart"><div className="y-labels"><span>৳80k</span><span>৳60k</span><span>৳40k</span><span>৳20k</span><span>৳0</span></div><div className="bars">{bars.map((height, index) => <div className="bar-group" key={index}><div className="bar income-bar" style={{ height: `${height}%` }}/><div className="bar expense-bar" style={{ height: `${Math.max(22, height - 24)}%` }}/><span>{["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][index]}</span></div>)}</div></div><div className="chart-note"><span className="note-icon">!</span><span>Collection is <b>৳4,250 above</b> the monthly average</span><span className="note-date">Updated just now</span></div></div><div className="panel rooms-panel"><div className="panel-heading"><div><h2>Rooms & seats</h2><p>24 of 28 seats occupied</p></div><button className="more">•••</button></div><div className="room-list">{[["101", "3 / 4", 3], ["203", "4 / 4", 4], ["305", "2 / 4", 2], ["401", "4 / 4", 4]].map(([room, total, occupied]) => <div className="room-row" key={room}><div className="room-number">{room}</div><div className="seat-row">{[0, 1, 2, 3].map(index => <i className={index < Number(occupied) ? "occupied" : "available"} key={index}/>)}</div><span>{total}</span></div>)}</div><button className="text-btn" onClick={() => setActive("Rooms & seats")}>View all rooms <span>→</span></button></div></section>
        <section className="bottom-grid"><div className="panel members-panel"><div className="panel-heading"><div><h2>Member overview</h2><p>Payment status for August</p></div><button className="text-btn" onClick={() => setActive("Members")}>See all <span>→</span></button></div><div className="table-wrap"><table><thead><tr><th>MEMBER</th><th>ROOM / SEAT</th><th>MEALS</th><th>STATUS</th><th>DUE</th></tr></thead><tbody>{members.map(member => <tr key={member.name}><td><div className="member-cell"><span className={`avatar avatar-${member.tone}`}>{member.initials}</span><strong>{member.name}</strong></div></td><td>{member.room}</td><td>{member.meals}</td><td><span className={`status status-${member.due ? "pending" : "paid"}`}>{member.due ? "Pending" : "Paid"}</span></td><td className={member.due ? "due-amount" : "paid-amount"}>{member.due ? money(member.due) : "—"}</td></tr>)}</tbody></table></div></div><div className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest updates across the house</p></div><button className="more">•••</button></div><div className="activity-list"><div><span className="activity-icon green-icon">৳</span><p><b>Payment received</b><br />Nusrat Jahan paid ৳3,500 <small>12 min ago</small></p></div><div><span className="activity-icon orange-icon">◈</span><p><b>New bazar entry</b><br />৳1,240 added by Sajid <small>48 min ago</small></p></div><div><span className="activity-icon purple-icon">♙</span><p><b>Member added</b><br />Mahi joined Room 101 <small>2 hrs ago</small></p></div></div><button className="text-btn">View activity log <span>→</span></button></div></section><div className="quick-actions"><span>QUICK ACTIONS</span>{["Add bazar", "Log meals", "Add expense", "Record payment"].map(action => <button key={action} onClick={() => quickAction(action)}><span>{action === "Add bazar" ? "◈" : action === "Log meals" ? "◒" : action === "Add expense" ? "↗" : "৳"}</span>{action}</button>)}</div></main>
      {showToast && <div className="toast">{active} is ready for your next entry <span>✓</span></div>}{showMemberForm && <div className="modal-backdrop" onClick={() => setShowMemberForm(false)}><div className="modal" onClick={event => event.stopPropagation()}><div className="modal-heading"><div><div className="eyebrow">NEW RECORD</div><h2>Add a member</h2></div><button className="close" onClick={() => setShowMemberForm(false)}>×</button></div><label>Full name<input placeholder="e.g. Tanvir Ahmed" /></label><div className="form-row"><label>Room<input placeholder="101" /></label><label>Seat<input placeholder="A" /></label></div><label>Phone number<input placeholder="01XXX-XXXXXX" /></label><button className="primary-btn full" onClick={() => { setShowMemberForm(false); setShowToast(true); window.setTimeout(() => setShowToast(false), 2600); }}>Save member <span>→</span></button></div></div>}
    </div>
  );
}

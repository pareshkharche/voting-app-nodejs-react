import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiFetch("/candidates/vote/count").then(setResults).catch((e) => setErr(e.message)).finally(() => setLoading(false));
  }, []);

  const total = results.reduce((s, r) => s + (r.count || 0), 0);
  const rankIcons = ["🥇", "🥈", "🥉"];

  return (
    <div className="page">
      <h1 className="page-title">Live Results</h1>
      <p className="page-sub">Real-time vote count across all candidates</p>
      {err && <div className="alert alert-error">⚠ {err}</div>}
      {loading ? (
        <div className="empty-state"><span className="spinner spinner-dark" /></div>
      ) : results.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📊</div><div>No votes recorded yet.</div></div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-value">{total}</div><div className="stat-label">Total Votes</div></div>
            <div className="stat-card"><div className="stat-value">{results.length}</div><div className="stat-label">Candidates</div></div>
            <div className="stat-card"><div className="stat-value" style={{ fontSize: "1.1rem" }}>{results[0]?.party || "—"}</div><div className="stat-label">Leading Party</div></div>
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Rank</th><th>Party</th><th>Votes</th><th>Share</th><th style={{ width: 180 }}>Progress</th></tr></thead>
                <tbody>
                  {results.map((r, i) => {
                    const pct = total > 0 ? Math.round((r.count / total) * 100) : 0;
                    return (
                      <tr key={r.party}>
                        <td style={{ fontWeight: 700, fontSize: "1.1rem" }}>{rankIcons[i] || `#${i + 1}`}</td>
                        <td style={{ fontWeight: 600 }}>{r.party}</td>
                        <td style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{r.count}</td>
                        <td style={{ color: "var(--muted)" }}>{pct}%</td>
                        <td><div className="vote-bar-track"><div className="vote-bar-fill" style={{ width: `${pct}%` }} /></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
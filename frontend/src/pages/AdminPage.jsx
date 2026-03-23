import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/api";
import ResultsPage from "./ResultsPage";

function Alert({ type = "error", msg }) {
  if (!msg) return null;
  return <div className={`alert alert-${type}`}><span>{type === "error" ? "⚠" : "✓"}</span> {msg}</div>;
}
function Spinner() { return <span className="spinner" />; }

export default function AdminPage() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState("candidates");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCandidate, setEditCandidate] = useState(null);
  const [form, setForm] = useState({ name: "", party: "", age: "", qualification: "" });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");

  const loadCandidates = () => {
    setLoading(true);
    apiFetch("/candidates").then(setCandidates).catch((e) => setErr(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { loadCandidates(); }, []);

  if (user?.role !== "admin") return (
    <div className="page"><div className="empty-state"><div className="empty-icon">🚫</div><div>Admin access only</div></div></div>
  );

  const openAdd = () => { setEditCandidate(null); setForm({ name: "", party: "", age: "", qualification: "" }); setFormErr(""); setShowModal(true); };
  const openEdit = (c) => { setEditCandidate(c); setForm({ name: c.name, party: c.party, age: c.age || "", qualification: c.qualification || "" }); setFormErr(""); setShowModal(true); };

  const saveCandidate = async () => {
    if (!form.name || !form.party) return setFormErr("Name and Party are required");
    setFormErr(""); setSaving(true);
    try {
      if (editCandidate) {
        await apiFetch(`/candidates/${editCandidate._id}`, { method: "PUT", body: JSON.stringify({ ...form, age: Number(form.age) }) }, token);
      } else {
        await apiFetch("/candidates", { method: "POST", body: JSON.stringify({ ...form, age: Number(form.age) }) }, token);
      }
      setShowModal(false); loadCandidates();
    } catch (e) { setFormErr(e.message); }
    finally { setSaving(false); }
  };

  const deleteCandidate = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await apiFetch(`/candidates/${id}`, { method: "DELETE" }, token); loadCandidates(); }
    catch (e) { setErr(e.message); }
  };

  return (
    <div className="page-wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "0.5rem" }}>
        <div><h1 className="page-title">Admin Panel</h1><p className="page-sub" style={{ marginBottom: 0 }}>Manage candidates and monitor the election</p></div>
        <button className="btn btn-accent" onClick={openAdd}>+ Add Candidate</button>
      </div>
      <div className="tabs" style={{ marginTop: "1.5rem" }}>
        <button className={`tab-btn ${tab === "candidates" ? "active" : ""}`} onClick={() => setTab("candidates")}>Candidates</button>
        <button className={`tab-btn ${tab === "results" ? "active" : ""}`} onClick={() => setTab("results")}>Results</button>
      </div>
      <Alert msg={err} />
      {tab === "candidates" && (
        loading ? <div className="empty-state"><span className="spinner spinner-dark" /></div> :
        candidates.length === 0 ? <div className="empty-state"><div className="empty-icon">👤</div><div>No candidates yet.</div></div> :
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Party</th><th>Age</th><th>Qualification</th><th>Votes</th><th>Actions</th></tr></thead>
              <tbody>
                {candidates.map((c, i) => (
                  <tr key={c._id}>
                    <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.party}</td><td>{c.age || "—"}</td><td>{c.qualification || "—"}</td>
                    <td style={{ fontWeight: 700 }}>{c.voteCount ?? 0}</td>
                    <td><div className="btn-group"><button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>✏ Edit</button><button className="btn btn-red btn-sm" onClick={() => deleteCandidate(c._id, c.name)}>🗑</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "results" && <ResultsPage />}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2 className="modal-title">{editCandidate ? "Edit Candidate" : "Add New Candidate"}</h2>
            <Alert msg={formErr} />
            <div className="form-row">
              <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Party *</label><input className="form-input" value={form.party} onChange={(e) => setForm((f) => ({ ...f, party: e.target.value }))} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Qualification</label><input className="form-input" value={form.qualification} onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))} /></div>
            </div>
            <div className="btn-group" style={{ justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-accent" onClick={saveCandidate} disabled={saving}>{saving ? <Spinner /> : editCandidate ? "Save Changes" : "Add Candidate"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/api";

function Spinner() { return <span className="spinner" />; }
function Alert({ type = "error", msg }) {
  if (!msg) return null;
  return <div className={`alert alert-${type}`}><span>{type === "error" ? "⚠" : "✓"}</span> {msg}</div>;
}

// ✅ Custom Confirm Modal - no more ugly browser popup!
function ConfirmModal({ candidate, onConfirm, onCancel, loading }) {
  if (!candidate) return null;
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 400, textAlign: "center" }}>
        
        {/* Candidate Avatar */}
        <div style={{
          width: 70, height: 70, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--saffron), var(--green))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.8rem", fontFamily: "'Playfair Display', serif",
          fontWeight: 900, color: "white", margin: "0 auto 1.25rem"
        }}>
          {candidate.name[0].toUpperCase()}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.3rem", fontWeight: 900,
          marginBottom: "0.5rem"
        }}>
          Confirm Your Vote
        </h2>

        {/* Message */}
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
          You are about to vote for
        </p>
        <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>
          {candidate.name}
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          🏛 {candidate.party}
        </p>

        {/* Warning */}
        <div className="alert alert-warning" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
          ⚠ This action cannot be undone. You can only vote once.
        </div>

        {/* Buttons */}
        <div className="btn-group" style={{ justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-accent" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner /> : "✓ Confirm Vote"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default function VotePage() {
  const { token, user, setUser } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Track which candidate user clicked
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    apiFetch("/candidates")
      .then(setCandidates)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Opens the custom modal
  const handleVoteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setErr("");
    setSuccess("");
  };

  // Called when user clicks Confirm inside modal
  const confirmVote = async () => {
    setVoting(true);
    try {
      await apiFetch(`/candidates/vote/${selectedCandidate._id}`, { method: "GET" }, token);
      setSuccess(`✓ Your vote for ${selectedCandidate.name} has been recorded!`);
      setUser((u) => ({ ...u, isVoted: true }));
      setSelectedCandidate(null);
    } catch (e) {
      setErr(e.message);
      setSelectedCandidate(null);
    } finally {
      setVoting(false);
    }
  };

  // Called when user clicks Cancel
  const cancelVote = () => {
    setSelectedCandidate(null);
  };

  return (
    <div className="page-wide">
      <h1 className="page-title">Cast Your Vote</h1>
      <p className="page-sub">Choose your candidate wisely. You can only vote once.</p>

      <Alert msg={err} />
      <Alert type="success" msg={success} />

      {user?.role === "admin" && (
        <div className="alert alert-warning">⚠ Admins are not allowed to vote.</div>
      )}
      {user?.isVoted && (
        <div className="alert alert-success">✓ You have already cast your vote. Thank you!</div>
      )}

      {loading ? (
        <div className="empty-state"><span className="spinner spinner-dark" /></div>
      ) : candidates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div>No candidates available yet.</div>
        </div>
      ) : (
        <div className="card-grid">
          {candidates.map((c) => (
            <div key={c._id} className="candidate-card">
              <div className="candidate-avatar">{(c.name || "?")[0].toUpperCase()}</div>
              <div className="candidate-name">{c.name}</div>
              <div className="candidate-party">🏛 {c.party}</div>
              {c.age && (
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                  Age: {c.age}
                </div>
              )}
              <hr className="divider" />
              <button
                className={`btn btn-full btn-sm ${user?.isVoted || user?.role === "admin" ? "btn-ghost" : "btn-accent"}`}
                disabled={user?.isVoted || user?.role === "admin" || voting}
                onClick={() => handleVoteClick(c)}
              >
                {user?.isVoted ? "✓ Vote Cast" : user?.role === "admin" ? "Not Allowed" : "Vote →"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Custom Modal - shows when candidate is selected */}
      <ConfirmModal
        candidate={selectedCandidate}
        onConfirm={confirmVote}
        onCancel={cancelVote}
        loading={voting}
      />
    </div>
  );
}
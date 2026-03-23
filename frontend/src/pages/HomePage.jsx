import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-eyebrow">🇮🇳 Democratic Voting Platform</div>
        <h1 className="hero-title">Your Vote,<br />Your <em>Voice</em></h1>
        <p className="hero-sub">
          Participate in India's digital democracy. Securely cast your vote using your Aadhar credentials.
        </p>
        <div className="btn-group" style={{ justifyContent: "center" }}>
          {user ? (
            <>
              <button className="btn btn-primary" onClick={() => navigate("/vote")}>🗳 Cast Your Vote</button>
              <button className="btn btn-ghost" onClick={() => navigate("/results")}>📊 Live Results</button>
            </>
          ) : (
            <>
              <button className="btn btn-accent" onClick={() => navigate("/login")}>Get Started →</button>
              <button className="btn btn-ghost" onClick={() => navigate("/results")}>📊 View Results</button>
            </>
          )}
        </div>
      </div>

      <div className="stat-grid">
        {[
          { icon: "🗳", label: "Cast Your Vote",      color: "var(--saffron)" },
          { icon: "🔒", label: "Aadhar Secured",      color: "var(--green)"   },
          { icon: "📊", label: "Live Results",        color: "var(--ink)"     },
          { icon: "1×", label: "One Vote Per Person", color: "var(--red)"     },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {user && (
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginTop: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.25rem" }}>Logged in as</div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{user.name}</div>
            <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.5rem" }}>
              <span className={`badge badge-${user.role}`}>{user.role}</span>
              <span className={`badge ${user.isVoted ? "badge-voted" : "badge-not-voted"}`}>
                {user.isVoted ? "✓ Voted" : "Not Voted Yet"}
              </span>
            </div>
          </div>
          <div className="btn-group">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/profile")}>My Profile</button>
            {user.role === "admin" && (
              <button className="btn btn-accent btn-sm" onClick={() => navigate("/admin")}>Admin Panel</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/api";

function Alert({ type = "error", msg }) {
  if (!msg) return null;
  return <div className={`alert alert-${type}`}><span>{type === "error" ? "⚠" : "✓"}</span> {msg}</div>;
}
function Spinner() { return <span className="spinner" />; }

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ aadharCardNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!form.aadharCardNumber || !form.password) return setErr("Please fill all fields");
    setErr(""); setLoading(true);
    try {
      const data = await apiFetch("/user/login", { method: "POST", body: JSON.stringify(form) });
      login(data.token);
      navigate("/");
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="card">
      <Alert msg={err} />
      <div className="form-group">
        <label className="form-label">Aadhar Card Number</label>
        <input className="form-input" placeholder="Enter 12-digit Aadhar number" maxLength={12}
          value={form.aadharCardNumber} onChange={(e) => setForm({ ...form, aadharCardNumber: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" placeholder="Your password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
      </div>
      <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
        {loading ? <Spinner /> : "Sign In →"}
      </button>
    </div>
  );
}

function SignupForm({ onTab }) {
  const [form, setForm] = useState({ name: "", age: "", email: "", mobile: "", address: "", aadharCardNumber: "", password: "", role: "voter" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setErr(""); setLoading(true);
    try {
      await apiFetch("/user/signup", { method: "POST", body: JSON.stringify({ ...form, age: Number(form.age) }) });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => onTab("login"), 2000);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="card">
      <Alert msg={err} />
      <Alert type="success" msg={success} />
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" placeholder="Ramesh Kumar" value={form.name} onChange={(e) => f("name", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Age</label>
          <input className="form-input" type="number" placeholder="25" value={form.age} onChange={(e) => f("age", e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => f("email", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Mobile</label>
          <input className="form-input" placeholder="9876543210" value={form.mobile} onChange={(e) => f("mobile", e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Address</label>
        <input className="form-input" placeholder="Your full address" value={form.address} onChange={(e) => f("address", e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Aadhar Number</label>
          <input className="form-input" placeholder="12 digits" maxLength={12} value={form.aadharCardNumber} onChange={(e) => f("aadharCardNumber", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-input" value={form.role} onChange={(e) => f("role", e.target.value)}>
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" placeholder="Create a strong password" value={form.password} onChange={(e) => f("password", e.target.value)} />
      </div>
      <button className="btn btn-accent btn-full" onClick={handleSubmit} disabled={loading}>
        {loading ? <Spinner /> : "Create Account →"}
      </button>
    </div>
  );
}

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  return (
    <div className="page-narrow">
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div className="hero-eyebrow">🗳 Voter Authentication</div>
        <h1 className="page-title" style={{ fontSize: "2rem" }}>
          {tab === "login" ? "Welcome Back" : "Register to Vote"}
        </h1>
      </div>
      <div className="tabs">
        <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
        <button className={`tab-btn ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Sign Up</button>
      </div>
      {tab === "login" ? <LoginForm /> : <SignupForm onTab={setTab} />}
    </div>
  );
}
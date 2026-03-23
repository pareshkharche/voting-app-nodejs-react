import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/api";

function Alert({ type = "error", msg }) {
  if (!msg) return null;
  return <div className={`alert alert-${type}`}><span>{type === "error" ? "⚠" : "✓"}</span> {msg}</div>;
}
function Spinner() { return <span className="spinner" />; }

export default function ProfilePage() {
  const { token, user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", msg: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: "", msg: "" });

useEffect(() => {
    if (user) setEditForm({ 
        name: user.name || "", 
        email: user.email || "", 
        mobile: user.mobile || "", 
        address: user.address || "", 
        age: user.age || "" 
    });
}, [user]);

  if (!user) return null;

  const cancelEdit = () => { setEditing(false); setEditForm({ name: user.name || "", email: user.email || "", mobile: user.mobile || "", address: user.address || "", age: user.age || "" }); };

  const saveProfile = async () => {
    setSavingProfile(true); setProfileMsg({ type: "", msg: "" });
    try {
      const updated = await apiFetch("/user/profile", { method: "PUT", body: JSON.stringify({ ...editForm, age: Number(editForm.age) }) }, token);
      setUser((u) => ({ ...u, ...updated }));
      setEditing(false);
      setProfileMsg({ type: "success", msg: "Profile updated successfully!" });
    } catch (e) { setProfileMsg({ type: "error", msg: e.message }); }
    finally { setSavingProfile(false); }
  };

  const changePassword = async () => {
    setPwMsg({ type: "", msg: "" });
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwMsg({ type: "error", msg: "Passwords do not match!" });
    if (pwForm.newPassword.length < 6) return setPwMsg({ type: "error", msg: "Min 6 characters required." });
    setSavingPw(true);
    try {
      await apiFetch("/user/profile/password", { method: "PUT", body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }) }, token);
      setPwMsg({ type: "success", msg: "Password changed successfully!" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) { setPwMsg({ type: "error", msg: e.message }); }
    finally { setSavingPw(false); }
  };

  const aadhar = String(user.aadharCardNumber || "");
  const maskedAadhar = aadhar.length >= 4 ? `XXXX XXXX ${aadhar.slice(-4)}` : "—";

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <div className="profile-hero">
        <div className="profile-avatar-lg">{user.name?.[0]?.toUpperCase()}</div>
        <div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-badges">
            <span className={`badge badge-${user.role}`}>{user.role}</span>
            <span className={`badge ${user.isVoted ? "badge-voted" : "badge-not-voted"}`}>{user.isVoted ? "✓ Voted" : "✗ Not Voted"}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 className="section-title" style={{ margin: 0 }}>Personal Information</h2>
          {!editing ? (
            <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(true); setProfileMsg({ type: "", msg: "" }); }}>✏ Edit</button>
          ) : (
            <div className="btn-group">
              <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
              <button className="btn btn-green btn-sm" onClick={saveProfile} disabled={savingProfile}>{savingProfile ? <Spinner /> : "Save"}</button>
            </div>
          )}
        </div>
        <Alert type={profileMsg.type} msg={profileMsg.msg} />
        {!editing ? (
          <div>
            {[["👤 Full Name", user.name], ["🎂 Age", user.age ? `${user.age} years` : "—"], ["📧 Email", user.email || "—"], ["📱 Mobile", user.mobile || "—"], ["🏠 Address", user.address || "—"], ["🪪 Aadhar", maskedAadhar], ["🛡 Role", user.role]].map(([label, value]) => (
              <div className="info-row" key={label}><span className="info-label">{label}</span><span className="info-value">{value}</span></div>
            ))}
          </div>
        ) : (
          <div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" value={editForm.age} onChange={(e) => setEditForm((f) => ({ ...f, age: e.target.value }))} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Mobile</label><input className="form-input" value={editForm.mobile} onChange={(e) => setEditForm((f) => ({ ...f, mobile: e.target.value }))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Aadhar</label><input className="form-input" value={maskedAadhar} disabled /><div className="form-hint">🔒 Cannot be changed</div></div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="section-title">Change Password</h2>
        <Alert type={pwMsg.type} msg={pwMsg.msg} />
        <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))} /></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" value={pwForm.newPassword} onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))} /></div>
        </div>
        <button className="btn btn-primary" onClick={changePassword} disabled={savingPw}>{savingPw ? <Spinner /> : "Update Password"}</button>
      </div>

      <div className="card" style={{ borderColor: "#fecaca" }}>
        <h2 className="section-title" style={{ color: "var(--red)" }}>Account</h2>
        <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1rem" }}>Sign out from your account.</p>
        <button className="btn btn-red" onClick={() => { logout(); navigate("/"); }}>Sign Out</button>
      </div>
    </div>
  );
}
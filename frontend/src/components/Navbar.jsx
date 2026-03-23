import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, loadingUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">
        🗳 <span>Voting</span>App
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
          Home
        </NavLink>
        <NavLink to="/vote" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
          Vote
        </NavLink>
        <NavLink to="/results" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
          Results
        </NavLink>

        {user?.role === "admin" && (
          <NavLink to="/admin" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
            Admin
          </NavLink>
        )}

        {/* ✅ Show loading state while fetching user */}
        {loadingUser ? (
          <span className="nav-btn" style={{ opacity: 0.5 }}>Loading...</span>
        ) : user ? (
          <>
            <NavLink to="/profile" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
              👤 {user.name?.split(" ")[0]}
            </NavLink>
            <button className="nav-btn danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-btn accent">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import VotePage from "./pages/VotePage";
import ResultsPage from "./pages/ResultsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route path="/login"   element={<AuthPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/vote"    element={<ProtectedRoute><VotePage /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
<Route path="/admin"   element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="*"        element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
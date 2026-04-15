import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h1>Campus Study Hub</h1>
      <p>Welcome, {user?.name || "Student"}!</p>

      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <Link to="/sessions">
          <button>Manage Study Sessions</button>
        </Link>

        <Link to="/resources">
          <button>Manage Study Resources</button>
        </Link>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;

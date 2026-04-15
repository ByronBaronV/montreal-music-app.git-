import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import StudySessions from "./pages/StudySessions";
import StudyResources from "./pages/StudyResources";

function PrivateRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/sessions"
        element={
          <PrivateRoute>
            <StudySessions />
          </PrivateRoute>
        }
      />

      <Route
        path="/resources"
        element={
          <PrivateRoute>
            <StudyResources />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

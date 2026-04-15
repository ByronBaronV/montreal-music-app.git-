import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket";

function StudySessions() {
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [realtimeMessage, setRealtimeMessage] = useState("");

  const loadSessions = async () => {
    try {
      const response = await api.get("/sessions");
      setSessions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load sessions");
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    function onSessionCreated(newSession) {
      setRealtimeMessage(`Realtime: new session created - ${newSession.title}`);
      loadSessions();
    }

    function onSessionUpdated(updatedSession) {
      setRealtimeMessage(`Realtime: session updated - ${updatedSession.title}`);
      loadSessions();
    }

    socket.on("session:created", onSessionCreated);
    socket.on("session:updated", onSessionUpdated);

    return () => {
      socket.off("session:created", onSessionCreated);
      socket.off("session:updated", onSessionUpdated);
    };
  }, []);

  const clearForm = () => {
    setTitle("");
    setCourse("");
    setDate("");
    setLocation("");
    setDescription("");
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = { title, course, date, location, description };

      if (editingId) {
        await api.put(`/sessions/${editingId}`, payload);
      } else {
        await api.post("/sessions", payload);
      }

      clearForm();
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save session");
    }
  };

  const startEdit = (session) => {
    setEditingId(session._id);
    setTitle(session.title);
    setCourse(session.course);
    setDate(session.date);
    setLocation(session.location);
    setDescription(session.description || "");
  };

  const handleDelete = async (id) => {
    setError("");

    try {
      await api.delete(`/sessions/${id}`);
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete session");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto" }}>
      <h2>Study Sessions</h2>
      <p>
        <Link to="/">Back to Home</Link>
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        <h3>{editingId ? "Edit Session" : "Create Session"}</h3>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />

        <input
          type="text"
          placeholder="Course (example: TT4)"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />

        <input
          type="text"
          placeholder="Date and time (example: Friday 3 PM)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />

        <button type="submit">{editingId ? "Update Session" : "Create Session"}</button>
        {editingId && (
          <button type="button" onClick={clearForm} style={{ marginLeft: "8px" }}>
            Cancel Edit
          </button>
        )}
      </form>

      {realtimeMessage && <p style={{ color: "green" }}>{realtimeMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>My Sessions</h3>
      {sessions.length === 0 && <p>No sessions yet.</p>}

      {sessions.map((session) => (
        <div
          key={session._id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px"
          }}
        >
          <h4>{session.title}</h4>
          <p>Course: {session.course}</p>
          <p>Date: {session.date}</p>
          <p>Location: {session.location}</p>
          <p>Description: {session.description || "No description"}</p>

          <button onClick={() => startEdit(session)}>Edit</button>
          <button onClick={() => handleDelete(session._id)} style={{ marginLeft: "8px" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default StudySessions;

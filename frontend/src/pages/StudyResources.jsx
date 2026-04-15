import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket";

function StudyResources() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [realtimeMessage, setRealtimeMessage] = useState("");

  const loadResources = async () => {
    try {
      const response = await api.get("/resources");
      setResources(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load resources");
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    function onResourceCreated(newResource) {
      setRealtimeMessage(`Realtime: new resource shared - ${newResource.title}`);
      loadResources();
    }

    function onResourceUpdated(updatedResource) {
      setRealtimeMessage(`Realtime: resource updated - ${updatedResource.title}`);
      loadResources();
    }

    socket.on("resource:created", onResourceCreated);
    socket.on("resource:updated", onResourceUpdated);

    return () => {
      socket.off("resource:created", onResourceCreated);
      socket.off("resource:updated", onResourceUpdated);
    };
  }, []);

  const clearForm = () => {
    setTitle("");
    setCourse("");
    setLink("");
    setDescription("");
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = { title, course, link, description };

      if (editingId) {
        await api.put(`/resources/${editingId}`, payload);
      } else {
        await api.post("/resources", payload);
      }

      clearForm();
      loadResources();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save resource");
    }
  };

  const startEdit = (resource) => {
    setEditingId(resource._id);
    setTitle(resource.title);
    setCourse(resource.course);
    setLink(resource.link);
    setDescription(resource.description || "");
  };

  const handleDelete = async (id) => {
    setError("");

    try {
      await api.delete(`/resources/${id}`);
      loadResources();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete resource");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto" }}>
      <h2>Study Resources</h2>
      <p>
        <Link to="/">Back to Home</Link>
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        <h3>{editingId ? "Edit Resource" : "Add Resource"}</h3>

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
          type="url"
          placeholder="Link (example: https://...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />

        <button type="submit">{editingId ? "Update Resource" : "Add Resource"}</button>
        {editingId && (
          <button type="button" onClick={clearForm} style={{ marginLeft: "8px" }}>
            Cancel Edit
          </button>
        )}
      </form>

      {realtimeMessage && <p style={{ color: "green" }}>{realtimeMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>My Resources</h3>
      {resources.length === 0 && <p>No resources yet.</p>}

      {resources.map((resource) => (
        <div
          key={resource._id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px"
          }}
        >
          <h4>{resource.title}</h4>
          <p>Course: {resource.course}</p>
          <p>
            Link:{" "}
            <a href={resource.link} target="_blank" rel="noreferrer">
              {resource.link}
            </a>
          </p>
          <p>Description: {resource.description || "No description"}</p>

          <button onClick={() => startEdit(resource)}>Edit</button>
          <button onClick={() => handleDelete(resource._id)} style={{ marginLeft: "8px" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default StudyResources;

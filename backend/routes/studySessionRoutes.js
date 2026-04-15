const express = require("express");
const StudySession = require("../models/StudySession");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, course, date, location, description } = req.body;

    if (!title || !course || !date || !location) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const session = await StudySession.create({
      title,
      course,
      date,
      location,
      description: description || "",
      createdBy: req.user.id
    });

    const io = req.app.get("io");
    io.emit("session:created", session);

    return res.status(201).json(session);
  } catch (error) {
    return res.status(500).json({ message: "Server error creating session" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await StudySession.find({ createdBy: req.user.id }).sort({
      createdAt: -1
    });
    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({ message: "Server error getting sessions" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.json(session);
  } catch (error) {
    return res.status(500).json({ message: "Server error getting session" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, course, date, location, description } = req.body;

    const updatedSession = await StudySession.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id
      },
      {
        title,
        course,
        date,
        location,
        description: description || ""
      },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    const io = req.app.get("io");
    io.emit("session:updated", updatedSession);

    return res.json(updatedSession);
  } catch (error) {
    return res.status(500).json({ message: "Server error updating session" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedSession = await StudySession.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!deletedSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    const io = req.app.get("io");
    io.emit("session:deleted", { id: req.params.id });

    return res.json({ message: "Session deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting session" });
  }
});

module.exports = router;

const express = require("express");
const StudyResource = require("../models/StudyResource");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, course, link, description } = req.body;

    if (!title || !course || !link) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const resource = await StudyResource.create({
      title,
      course,
      link,
      description: description || "",
      createdBy: req.user.id
    });

    const io = req.app.get("io");
    io.emit("resource:created", resource);

    return res.status(201).json(resource);
  } catch (error) {
    return res.status(500).json({ message: "Server error creating resource" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const resources = await StudyResource.find({ createdBy: req.user.id }).sort({
      createdAt: -1
    });
    return res.json(resources);
  } catch (error) {
    return res.status(500).json({ message: "Server error getting resources" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const resource = await StudyResource.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    return res.json(resource);
  } catch (error) {
    return res.status(500).json({ message: "Server error getting resource" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, course, link, description } = req.body;

    const updatedResource = await StudyResource.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id
      },
      {
        title,
        course,
        link,
        description: description || ""
      },
      { new: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const io = req.app.get("io");
    io.emit("resource:updated", updatedResource);

    return res.json(updatedResource);
  } catch (error) {
    return res.status(500).json({ message: "Server error updating resource" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedResource = await StudyResource.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!deletedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const io = req.app.get("io");
    io.emit("resource:deleted", { id: req.params.id });

    return res.json({ message: "Resource deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting resource" });
  }
});

module.exports = router;

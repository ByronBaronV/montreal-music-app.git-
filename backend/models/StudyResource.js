const mongoose = require("mongoose");

const studyResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    course: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("StudyResource", studyResourceSchema);

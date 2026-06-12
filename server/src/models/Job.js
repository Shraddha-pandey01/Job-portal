const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const jobSchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      required: true,
    },

    salary: {
      type: Number,
      default: null,
    },

    qualifications: {
      type: String,
      default: null,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

jobSchema.index({ employerId: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ location: 1 });

module.exports = mongoose.model("Job", jobSchema);
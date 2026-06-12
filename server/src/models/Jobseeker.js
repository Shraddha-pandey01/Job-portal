const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const jobseekerProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    phone: {
      type: String,
      default: null,
    },

    location: {
      type: String,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    resume: {
      url: {
        type: String,
        required: false,
        default: null,
      },
      fileType: {
        type: String,
        enum: ["pdf", "image", null],
        required: false,
        default: null,
      },
    },

    profileViews: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
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

jobseekerProfileSchema.index({ userId: 1 });

module.exports = mongoose.model("JobseekerProfile", jobseekerProfileSchema);
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    jobseekerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "interview"],
      default: "pending",
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

applicationSchema.index({ jobId: 1, jobseekerId: 1 }, { unique: true });
applicationSchema.index({ jobseekerId: 1 });
applicationSchema.index({ jobId: 1 });

module.exports = mongoose.model("Application", applicationSchema);
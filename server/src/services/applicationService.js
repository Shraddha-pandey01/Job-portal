const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const { createError } = require("../../helpers/errorHelper");

const applyJob = async (jobseekerId, jobId) => {
  const job = await Job.findOne({
    _id: jobId,
    status: "open",
    deletedAt: null,
  });
  if (!job) throw createError("Job not found!!", 404);

  const existingApplication = await Application.findOne({ jobId, jobseekerId });
  if (existingApplication) throw createError("Already applied for this job!!", 400);

  const application = await Application.create({ jobId, jobseekerId });

  // Create explicit notification for the employer identifying the new applicant correctly mapping natively!
  const User = require("../models/User");
  const seeker = await User.findById(jobseekerId);
  await Notification.create({
    userId: job.employerId,
    title: "New Job Application!",
    message: `${seeker?.fullName || 'A candidate'} just applied to your mapping for ${job.title}.`
  });

  return application;
};

const getMyApplications = async (jobseekerId) => {
  const applications = await Application.find({
    jobseekerId,
    deletedAt: null,
  })
    .populate("jobId", "title location jobType status")
    .sort({ createdAt: -1 });

  return applications;
};

const getJobApplications = async (employerId, jobId) => {
  const job = await Job.findOne({ _id: jobId, employerId, deletedAt: null });
  if (!job) throw createError("Job not found or unauthorised!!", 404);

  const applications = await Application.find({
    jobId,
    deletedAt: null,
  })
    .populate("jobseekerId", "fullName email")
    .sort({ createdAt: -1 })
    .lean();

  const Jobseeker = require("../models/Jobseeker");
  for (let app of applications) {
    if (app.jobseekerId) {
      const profile = await Jobseeker.findOne({ userId: app.jobseekerId._id }).lean();
      app.jobseekerProfile = profile || null;
    }
  }

  return applications;
};

const updateStatus = async (applicationId, status, employerId) => {
  if (!["accepted", "rejected", "interview"].includes(status)) {
    throw createError("Invalid status!!", 400);
  }

  const application = await Application.findOne({
    _id: applicationId,
    deletedAt: null,
  }).populate("jobId");

  if (!application) throw createError("Application not found!!", 404);

  if (application.jobId.employerId.toString() !== employerId) {
    throw createError("Unauthorised!!", 403);
  }

  application.status = status;
  await application.save();

  // Create notification for the jobseeker regarding their application status update
  const isInterview = status === "interview";
  await Notification.create({
    userId: application.jobseekerId,
    title: isInterview ? "Interview Invitation" : "Application Status Update",
    message: isInterview
      ? `You have been invited for an interview for ${application.jobId.title}.`
      : `Your application for ${application.jobId.title} was ${status}.`,
  });

  return application;
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateStatus,
};
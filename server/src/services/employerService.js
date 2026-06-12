const Employer = require("../models/Employer");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { createError } = require("../../helpers/errorHelper");

const getProfile = async (userId) => {
  const profile = await Employer.findOne({ userId, deletedAt: null }).populate("userId");
  if (!profile) throw createError("Profile not found!!", 404);

  return {
    ...profile.toObject(),
    fullName: profile.userId?.fullName,
    email: profile.userId?.email,
  };
};

const updateProfile = async (userId, data) => {
  const { companyName, phone } = data;

  const updateData = {};
  if (companyName !== undefined) updateData.companyName = companyName;
  if (phone !== undefined) updateData.phone = phone;

  const profile = await Employer.findOneAndUpdate(
    { userId, deletedAt: null },
    updateData,
    { returnDocument: "after" },
  ).populate("userId");

  if (!profile) throw createError("Profile not found!!", 404);

  // Set complete
  const isComplete = !!(profile.companyName && profile.phone);
  await User.findByIdAndUpdate(userId, { isProfileComplete: isComplete });

  return {
    ...profile.toObject(),
    fullName: profile.userId?.fullName,
    email: profile.userId?.email,
  };
};

const getMyJobs = async (userId) => {
  const jobs = await Job.find({ employerId: userId, deletedAt: null }).sort({ createdAt: -1 });
  return jobs;
};

const viewProfile = async (employerUserId, jobseekerUserId) => {
  const profile = await Employer.findOneAndUpdate(
    { userId: employerUserId, deletedAt: null },
    { $addToSet: { profileViews: jobseekerUserId } },
    { returnDocument: "after" }
  );
  return profile;
};

const getDashboardStats = async (employerId) => {
  // 1. Active Jobs: count of jobs with status = 'open'
  const activeJobsCount = await Job.countDocuments({ employerId, status: "open", deletedAt: null });

  // 2. Total Applicants: count of applications for jobs posted by this employer
  const jobs = await Job.find({ employerId, deletedAt: null }, { _id: 1 });
  const jobIds = jobs.map(j => j._id);
  const totalApplicants = await Application.countDocuments({ jobId: { $in: jobIds }, deletedAt: null });

  // 3. Interviews Scheduled: count of applications with status = 'interview'
  const interviewsScheduled = await Application.countDocuments({ jobId: { $in: jobIds }, status: "interview", deletedAt: null });

  // 4. Profile Views: count of views from employer profile
  const employerProfile = await Employer.findOne({ userId: employerId, deletedAt: null });
  const profileViews = employerProfile?.profileViews?.length || 0;

  // 5. Recent Applicants list: get latest 5 applications for jobs posted by this employer
  const recentApplications = await Application.find({ jobId: { $in: jobIds }, deletedAt: null })
    .populate("jobId", "title")
    .populate("jobseekerId", "fullName email")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    activeJobs: activeJobsCount,
    totalApplicants,
    interviewsScheduled,
    profileViews,
    recentApplicants: recentApplications.map(app => ({
      _id: app._id,
      jobId: app.jobId?._id || app.jobId,
      name: app.jobseekerId?.fullName || "Unknown",
      role: app.jobId?.title || "Unknown Role",
      date: new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pending",
      badge: app.status === "accepted" ? "badge-success" : app.status === "rejected" ? "badge-danger" : app.status === "interview" ? "badge-info" : "badge-warning"
    }))
  };
};

module.exports = {
  getProfile,
  updateProfile,
  getMyJobs,
  viewProfile,
  getDashboardStats,
};
const Job = require("../models/Job");
const { createError } = require("../../helpers/errorHelper");

const createJob = async (employerId, data) => {
  const {
    title,
    description,
    location,
    jobType,
    salary,
    qualifications,
    skillsRequired,
  } = data;

  if (!title || !description || !location || !jobType) {
    throw createError("All fields are required!!", 400);
  }

  const job = await Job.create({
    employerId,
    title,
    description,
    location,
    jobType,
    salary: salary || null,
    qualifications: qualifications || null,
    skillsRequired: skillsRequired || [],
  });

  return job;
};

const getJobById = async (jobId) => {
  const job = await Job.findOne({ _id: jobId, deletedAt: null }).populate("employerId", "fullName email").lean();
  if (!job) throw createError("Job not found!!", 404);

  const EmployerProfile = require("../models/Employer");
  const employerProfile = await EmployerProfile.findOne({ userId: job.employerId?._id || job.employerId }).lean();
  if (employerProfile) {
    job.employerProfile = employerProfile;
    if (job.employerId && typeof job.employerId === "object") {
      job.employerId.companyName = employerProfile.companyName;
    }
  }

  return job;
};

const getAllJobs = async (query) => {
  const { jobType, location, keyword } = query;

  const filter = { status: "open", deletedAt: null };

  if (jobType) filter.jobType = jobType;

  // ❌ ReDoS vulnerability fix — user input escape karo
  if (location) {
    const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.location = { $regex: escapedLocation, $options: "i" };
  }

  if (keyword) {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: escapedKeyword, $options: "i" } },
      { description: { $regex: escapedKeyword, $options: "i" } },
    ];
  }

  const jobs = await Job.find(filter)
    .populate("employerId", "fullName email")
    .sort({ createdAt: -1 })
    .lean();

  const EmployerProfile = require("../models/Employer");
  for (let job of jobs) {
    if (job.employerId) {
      const employerProfile = await EmployerProfile.findOne({ userId: job.employerId?._id || job.employerId }).lean();
      if (employerProfile) {
        job.employerProfile = employerProfile;
        if (job.employerId && typeof job.employerId === "object") {
          job.employerId.companyName = employerProfile.companyName;
        }
      }
    }
  }

  return jobs;
};

const updateJob = async (employerId, jobId, data) => {
  const {
    title,
    description,
    location,
    jobType,
    salary,
    qualifications,
    skillsRequired,
  } = data;

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (location) updateData.location = location;
  if (jobType) updateData.jobType = jobType;
  if (salary) updateData.salary = salary;
  if (qualifications) updateData.qualifications = qualifications;
  if (skillsRequired) updateData.skillsRequired = skillsRequired;

  const job = await Job.findOneAndUpdate(
    { _id: jobId, employerId, deletedAt: null },
    updateData,
    { returnDocument: "after" },
  );

  if (!job) throw createError("Job not found or unauthorized!!", 404);

  return job;
};

const deleteJob = async (employerId, jobId) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, employerId, deletedAt: null },
    { deletedAt: new Date() },
    { returnDocument: "after" },
  );

  if (!job) throw createError("Job not found or unauthorized!!", 404);

  return { message: "Deleted Successfully!!" };
};

module.exports = {
  createJob,
  getJobById,
  getAllJobs,
  updateJob,
  deleteJob,
};
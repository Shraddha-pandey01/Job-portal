const User = require("../models/User");
const Jobseeker = require("../models/Jobseeker");
const Job = require("../models/Job");
const { createError } = require("../../helpers/errorHelper");

const getProfile = async (userId) => {
  const profile = await Jobseeker.findOne({ userId, deletedAt: null }).populate("userId");
  if (!profile) throw createError("Profile not found!!", 404);

  return {
    ...profile.toObject(),
    fullName: profile.userId?.fullName,
    email: profile.userId?.email,
  };
};

const updateProfile = async (userId, data) => {
  const { phone, location, skills } = data;

  const updateData = {};
  if (phone !== undefined) updateData.phone = phone;
  if (location !== undefined) updateData.location = location;
  if (skills !== undefined) updateData.skills = skills;

  const profile = await Jobseeker.findOneAndUpdate(
    { userId, deletedAt: null },
    updateData,
    { returnDocument: "after" },
  ).populate("userId");

  if (!profile) throw createError("Profile not found!!", 404);

  // Recalculate isProfileComplete dynamically based on all fields
  const isComplete = !!(profile.phone && profile.location && profile.skills?.length > 0 && profile.resume?.url);
  await User.findByIdAndUpdate(userId, { isProfileComplete: isComplete });

  return {
    ...profile.toObject(),
    fullName: profile.userId?.fullName,
    email: profile.userId?.email,
  };
};

const uploadResume = async (userId, file) => {
  if (!file) throw createError("File not uploaded!!", 400);

  const fileType = file.mimetype.startsWith("image") ? "image" : "pdf";

  const profile = await Jobseeker.findOneAndUpdate(
    { userId, deletedAt: null },
    {
      resume: {
        url: file.path,
        fileType,
      },
    },
    { returnDocument: "after" },
  ).populate("userId");

  if (!profile) throw createError("Profile not found!!", 404);

  // Recalculate isProfileComplete dynamically
  const isComplete = !!(profile.phone && profile.location && profile.skills?.length > 0 && profile.resume?.url);
  await User.findByIdAndUpdate(userId, { isProfileComplete: isComplete });

  return {
    ...profile.toObject(),
    fullName: profile.userId?.fullName,
    email: profile.userId?.email,
  };
};

const viewProfile = async (jobseekerUserId, employerUserId) => {
  const profile = await Jobseeker.findOneAndUpdate(
    { userId: jobseekerUserId, deletedAt: null },
    { $addToSet: { profileViews: employerUserId } },
    { returnDocument: "after" }
  );
  return profile;
};

const getAiRecommendations = async (userId) => {
  const profile = await Jobseeker.findOne({ userId, deletedAt: null }).lean();
  if (!profile) throw createError("Profile not found!!", 404);

  const skills = profile.skills || [];
  
  // Fetch all open jobs
  const jobs = await Job.find({ status: "open", deletedAt: null }).lean();
  if (jobs.length === 0) return [];

  if (skills.length === 0) {
    // If user has no skills entered, return jobs in default order (newest first)
    const finalJobs = [...jobs].sort((a, b) => b.createdAt - a.createdAt);
    const EmployerProfile = require("../models/Employer");
    const User = require("../models/User");
    for (let job of finalJobs) {
      const employerProfile = await EmployerProfile.findOne({ userId: job.employerId }).lean();
      const userDoc = await User.findById(job.employerId, "fullName email").lean();
      if (userDoc) {
        job.employerId = userDoc;
        if (employerProfile) {
          job.employerId.companyName = employerProfile.companyName;
        }
      }
    }
    return finalJobs;
  }

  // Format jobs to minimize token count for the Gemini prompt
  const jobsData = jobs.map(j => ({
    id: j._id.toString(),
    title: j.title,
    description: j.description?.substring(0, 200),
    skillsRequired: j.skillsRequired || [],
  }));

  const prompt = `You are an AI job recommendation assistant. Your task is to recommend the best matching jobs for a jobseeker based on their skills.

Jobseeker Skills:
${skills.join(", ")}

Jobs List:
${JSON.stringify(jobsData)}

Analyze the jobs list and the jobseeker's skills. Select the top jobs that match the jobseeker's skills.
Return the result strictly as a JSON array of job IDs (strings), in order of most relevant to least relevant, like this:
["id1", "id2", "id3"]
Do not return any other text, markdown formatting, or explanations. Only return the valid JSON array of strings.`;

  try {
    const apiKey = process.env.GEMINI_API_KEY
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const resJson = await response.json();
    const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const recommendedIds = JSON.parse(cleanText);

    // Map the jobs for easy lookup
    const jobMap = new Map(jobs.map(j => [j._id.toString(), j]));
    const recommendedJobs = recommendedIds
      .map(id => jobMap.get(id))
      .filter(Boolean);

    // Append other jobs that weren't explicitly selected by AI
    const recommendedSet = new Set(recommendedIds);
    const otherJobs = jobs.filter(j => !recommendedSet.has(j._id.toString()));
    
    const finalJobs = [...recommendedJobs, ...otherJobs];

    // Populate employer details for compatibility
    const EmployerProfile = require("../models/Employer");
    const User = require("../models/User");
    for (let job of finalJobs) {
      const employerProfile = await EmployerProfile.findOne({ userId: job.employerId }).lean();
      if (employerProfile) {
        job.employerProfile = employerProfile;
      }
      const userDoc = await User.findById(job.employerId, "fullName email").lean();
      if (userDoc) {
        job.employerId = userDoc;
        if (job.employerId && employerProfile) {
          job.employerId.companyName = employerProfile.companyName;
        }
      }
    }

    return finalJobs;
  } catch (err) {
    console.error("Gemini AI matching error:", err);
    // Fallback to sorting jobs by creation date
    const sortedJobs = [...jobs].sort((a, b) => b.createdAt - a.createdAt);
    const EmployerProfile = require("../models/Employer");
    const User = require("../models/User");
    for (let job of sortedJobs) {
      const employerProfile = await EmployerProfile.findOne({ userId: job.employerId }).lean();
      const userDoc = await User.findById(job.employerId, "fullName email").lean();
      if (userDoc) {
        job.employerId = userDoc;
        if (employerProfile) {
          job.employerId.companyName = employerProfile.companyName;
        }
      }
    }
    return sortedJobs;
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  viewProfile,
  getAiRecommendations,
};
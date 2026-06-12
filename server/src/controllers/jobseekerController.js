const jobseekerService = require("../services/jobseekerServices");
const responseHelper = require("../../helpers/responseHelper");

const getProfile = async (req, res) => {
  try {
    const data = await jobseekerService.getProfile(req.user.userId);
    responseHelper.handleSuccess(res, data);
  } catch (error) {
    responseHelper.handleError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await jobseekerService.updateProfile(
      req.user.userId,
      req.body,
    );
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const uploadResume = async (req, res) => {
  try {
    const data = await jobseekerService.uploadResume(req.user.userId, req.file);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const viewProfile = async (req, res) => {
  try {
    const data = await jobseekerService.viewProfile(req.params.id, req.user.userId);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const getAiRecommendations = async (req, res) => {
  try {
    const data = await jobseekerService.getAiRecommendations(req.user.userId);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  viewProfile,
  getAiRecommendations,
};

const employerService = require("../services/employerService");
const responseHelper = require("../../helpers/responseHelper");

const getProfile = async (req, res) => {
  try {
    const data = await employerService.getProfile(req.user.userId);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await employerService.updateProfile(req.user.userId, req.body);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const getMyJobs = async (req, res) => {
  try {
    const data = await employerService.getMyJobs(req.user.userId);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const viewProfile = async (req, res) => {
  try {
    const data = await employerService.viewProfile(req.params.id, req.user.userId);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const data = await employerService.getDashboardStats(req.user.userId);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMyJobs,
  viewProfile,
  getDashboardStats,
};

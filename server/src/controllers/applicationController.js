const applicationService = require("../services/applicationService");
const responseHelper = require("../../helpers/responseHelper");

const applyJob = async (req, res) => {
  try {
    const data = await applicationService.applyJob(
      req.user.userId,
      req.params.jobId,
    );
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const getMyApplications = async (req, res) => {
  try {
    const data = await applicationService.getMyApplications(req.user.userId);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const getJobApplications = async (req, res) => {
  try {
    const data = await applicationService.getJobApplications(
      req.user.userId,
      req.params.jobId,
    );
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const updateStatus = async (req, res) => {
  try {
    const data = await applicationService.updateStatus(
      req.params.id,
      req.body.status,
      req.user.userId,
    );
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateStatus,
};

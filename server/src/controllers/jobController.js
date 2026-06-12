const jobService = require('../services/jobService')
const responseHelper = require('../../helpers/responseHelper')

const createJob = async(req, res) => {
  try {
    const data = await jobService.createJob(req.user.userId, req.body)
    return responseHelper.handleSuccess(res, data)
  } catch (error) {
    return responseHelper.handleError(res, error)
  }
}

const getJobById = async(req, res) => {
  try {
    const data = await jobService.getJobById(req.params.id)
    return responseHelper.handleSuccess(res, data)
  } catch (error) {
    return responseHelper.handleError(res, error)
  }
}

const getAllJobs = async(req, res) => {
    try {
        const data = await jobService.getAllJobs(req.query);
        return responseHelper.handleSuccess(res, data);
    } catch (error) {
        return responseHelper.handleError(res, error);
    }
}

const updateJob = async(req, res) => {
  try {
    const data = await jobService.updateJob(req.user.userId, req.params.id, req.body)
    return responseHelper.handleSuccess(res, data)
  } catch (error) {
    return responseHelper.handleError(res, error)
  }
}

const deleteJob = async(req, res) => {
  try {
    const data = await jobService.deleteJob(req.user.userId, req.params.id)
    return responseHelper.handleOK(res)
  } catch (error) {
    return responseHelper.handleError(res, error)
  }
}

module.exports = {
    createJob,
    getJobById,
    getAllJobs,
    updateJob,
    deleteJob
}
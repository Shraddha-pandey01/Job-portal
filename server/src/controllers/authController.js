const responseHelper = require("../../helpers/responseHelper");
const authService = require("../services/authService");
const authHelper = require("../../helpers/authHelper");
const redis = require("../modules/redis");

const register = async (req, res) => {
  try {
    const data = await authService.register(req.body);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    const refreshToken = authHelper.createRefreshToken(data.userId);

    await redis.set(data.userId, refreshToken, {
      EX: 60 * 60 * 24 * 7,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const rotateToken = async (req, res) => {
  try {
    const data = await authService.rotateToken(req.cookies.refreshToken);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    error.status = 403;
    return responseHelper.handleError(res, error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const data = await authService.changePassword(req.user.userId, currentPassword, newPassword);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

module.exports = {
  register,
  login,
  rotateToken,
  changePassword,
};

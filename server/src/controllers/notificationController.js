const Notification = require("../models/Notification");
const responseHelper = require("../../helpers/responseHelper");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50); // Get recent 50
    return responseHelper.handleSuccess(res, notifications);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isRead: true },
      { new: true, returnDocument: 'after' } // Compatible with latest mongoose
    );
    return responseHelper.handleSuccess(res, notification);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, isRead: false },
      { isRead: true }
    );
    return responseHelper.handleOK(res);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};

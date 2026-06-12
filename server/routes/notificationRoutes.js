const router = require("express").Router();
const notificationController = require("../src/controllers/notificationController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get(
  "/",
  verifyToken,
  notificationController.getMyNotifications
);

router.patch(
  "/:id/read",
  verifyToken,
  notificationController.markAsRead
);

router.post(
  "/read-all",
  verifyToken,
  notificationController.markAllAsRead
);

module.exports = router;

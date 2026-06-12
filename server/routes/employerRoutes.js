const router = require("express").Router();
const employerController = require("../src/controllers/employerController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

router.get(
  "/profile",
  verifyToken,
  authorizeRole("employer"),
  employerController.getProfile,
);
router.put(
  "/profile",
  verifyToken,
  authorizeRole("employer"),
  employerController.updateProfile,
);
router.get(
  "/jobs",
  verifyToken,
  authorizeRole("employer"),
  employerController.getMyJobs,
);

router.get(
  "/dashboard-stats",
  verifyToken,
  authorizeRole("employer"),
  employerController.getDashboardStats,
);

router.post(
  "/:id/view",
  verifyToken,
  authorizeRole("jobseeker"),
  employerController.viewProfile,
);

module.exports = router;

const router = require("express").Router();
const applicationController = require("../src/controllers/applicationController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

// JOBSEEKER
router.post(
  "/:jobId",
  verifyToken,
  authorizeRole("jobseeker"),
  applicationController.applyJob,
);

router.get(
  "/my",
  verifyToken,
  authorizeRole("jobseeker"),
  applicationController.getMyApplications,
);

// EMPLOYER
router.get(
  "/job/:jobId",
  verifyToken,
  authorizeRole("employer"),
  applicationController.getJobApplications,
);

router.put(
  "/:id/status",
  verifyToken,
  authorizeRole("employer"),
  applicationController.updateStatus,
);

module.exports = router;

const router = require("express").Router();
const jobseekerController = require("../src/controllers/jobseekerController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get(
  "/profile",
  verifyToken,
  authorizeRole("jobseeker"),
  jobseekerController.getProfile,
);

router.put(
  "/profile",
  verifyToken,
  authorizeRole("jobseeker"),
  jobseekerController.updateProfile,
);

router.post(
  "/resume",
  verifyToken,
  authorizeRole("jobseeker"),
  upload.single("resume"),
  jobseekerController.uploadResume,
);

router.post(
  "/:id/view",
  verifyToken,
  authorizeRole("employer"),
  jobseekerController.viewProfile,
);

router.get(
  "/ai-recommendations",
  verifyToken,
  authorizeRole("jobseeker"),
  jobseekerController.getAiRecommendations,
);

module.exports = router;

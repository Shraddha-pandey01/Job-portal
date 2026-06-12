const router = require("express").Router();
const jobController = require("../src/controllers/jobController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

router.post(
  "/",
  verifyToken,
  authorizeRole("employer"),
  jobController.createJob,
);

router.put(
  "/:id",
  verifyToken,
  authorizeRole("employer"),
  jobController.updateJob,
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole("employer"),
  jobController.deleteJob,
);

router.get("/", verifyToken, jobController.getAllJobs);

router.get("/:id", verifyToken, jobController.getJobById);

module.exports = router;

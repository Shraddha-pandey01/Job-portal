const router = require("express").Router();
const authController = require("../src/controllers/authController");
const { validate } = require("../validations/validate");
const { registerSchema, loginSchema } = require("../validations/userValidation");
const { verifyCookie, verifyToken } = require("../middlewares/authMiddleware");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

router.get("/refresh-token", verifyCookie, authController.rotateToken);

router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;
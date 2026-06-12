const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string().min(3).max(50),

  email: z.string().email(),

  password: z
    .string()
    .min(12)
    .max(20)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain uppercase, lowercase, number and special character",
    ),

  role: z.enum(["jobseeker", "employer"]),
});

const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(1, "Password is required"),
});

module.exports = {
  registerSchema,
  loginSchema,
};

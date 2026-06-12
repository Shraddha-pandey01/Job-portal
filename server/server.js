require("dotenv").config();
const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const userDatabase = require("./src/modules/user.db");
const jobseekerRoutes = require("./routes/jobseekerRoutes");
const employerRoutes = require("./routes/employerRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/jobseeker", jobseekerRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../client/dist")));

// Fallback to index.html for React Router
app.use(express.static(path.join(__dirname, "../client/dist")));

// ✅ FIXED fallback (React Router ke liye)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});
userDatabase.connectDb(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(
    `Server is listening on the port : ${port} http://localhost:${port}`,
  );
});
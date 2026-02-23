require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hiresense";

// Connect to DB (Restarted to grab new MongoDB connection)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => {
    console.log("MongoDB Error: ", err);
    process.exit(1); // Force exit if DB fails so nodemon restarts instead of hanging
  });

// Basic route
app.get("/", (req, res) => {
  res.send("HireSense API is running...");
});

// Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resumes", require("./routes/resumeRoutes"));
app.use("/api/interviews", require("./routes/interviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

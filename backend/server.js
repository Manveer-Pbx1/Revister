const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const schedule = require("node-schedule");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Save URL and notes endpoint
app.post("/save-url", (req, res) => {
  const { url, notes } = req.body;
  console.log("URL and notes received:", url, notes);
  res.status(200).send({ message: "URL and notes saved successfully" });
});

// Send notification endpoint
app.post("/send-notification", async (req, res) => {
  const { email, time } = req.body;

  if (!email || !time) {
    return res.status(400).send("Email and time are required");
  }

  const userDate = new Date(time);
  const utcDate = new Date(Date.UTC(
    userDate.getUTCFullYear(),
    userDate.getUTCMonth(),
    userDate.getUTCDate(),
    userDate.getUTCHours(),
    userDate.getUTCMinutes()
  ));

  console.log("Converted UTC date:", utcDate);

  if (isNaN(utcDate.getTime())) {
    console.error("Invalid date provided:", time);
    return res.status(400).send("Invalid date format");
  }

  const now = new Date();
  if (utcDate <= now) {
    console.error("Scheduled time is in the past:", utcDate);
    return res.status(400).send("Scheduled time must be in the future");
  }

  console.log("Scheduling email at:", utcDate);
  const job = schedule.scheduleJob(utcDate, async () => {
    console.log("Scheduled job triggered at:", new Date());
    try {
      await transporter.sendMail(mailOptions);
      console.log("Notification email sent to:", email);
    } catch (error) {
      console.error("Error sending scheduled email:", error);
    }
  });

  console.log("Scheduled job:", job);
  res.status(200).send("Notification email scheduled");
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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

app.post("/save-url", (req, res) => {
  const { url, notes } = req.body;
  console.log("URL and notes received:", url, notes);
  res.status(200).send({ message: "URL and notes saved successfully" });
});

app.post("/send-notification", async (req, res) => {
  const { email, time } = req.body;

  if (!email || !time) {
    return res.status(400).send("Email and time are required");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'revistergetconsistent@gmail.com',
      pass: 'aspy lwxf xsbd wcty',
    },
  });

  const mailOptions = {
    from: 'revistergetconsistent@gmail.com',
    to: email,
    subject: "Time to REVISIT with REVISTER",
    html: `
      <div style="padding: 24px">
        <h1>Time to get <strong><i>CONSISTENT</i></strong> and <strong><i>DISCIPLINED.</i></strong></h1>
        <img src="https://images.pexels.com/photos/330771/pexels-photo-330771.jpeg?auto=compress&cs=tinysrgb&w=600" style="height: 300px; width: 100%; background-size: cover; background-position: center; background-repeat: no-repeat;" />
        <h3><a href="https://revister-getconsistent.vercel.app/">Revisit problems</a></h3>
      </div>
    `,
  };

  const scheduleDate = new Date(time);
  console.log("Converted date (server local time):", scheduleDate);

  if (isNaN(scheduleDate.getTime())) {
    console.error("Invalid date provided:", time);
    return res.status(400).send("Invalid date format");
  }

  const now = new Date();
  console.log("Current server time:", now);
  if (scheduleDate <= now) {
    console.error("Scheduled time is in the past:", scheduleDate);
    return res.status(400).send("Scheduled time must be in the future");
  }

  schedule.scheduleJob(scheduleDate, async () => {
    console.log("Scheduled job triggered at:", new Date());
    try {
      await transporter.sendMail(mailOptions);
      console.log("Notification email sent to:", email);
    } catch (error) {
      console.error("Error sending scheduled email:", error);
    }
  });

  console.log("Notification email scheduled for:", scheduleDate);
  res.status(200).send("Notification email scheduled");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const schedule = require("node-schedule");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/send-notification", (req, res) => {
  const { email, time } = req.body;

  // Configure the transport options
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "revistergetconsistent@gmail.com",
      pass: "aspy lwxf xsbd wcty",
    },
  });

  // Define email options
  let mailOptions = {
    from: "revistergetconsistent@gmail.com",
    to: email,
    subject: "Notification Setup",
    html: `<div style="padding: 24px">
    <h1> Greetings from <strong><i>REVISTER</i></strong></h1>
    <p>Time to revisit those problems!</p>
            </div>`,
  };

  // Schedule the email
  const date = new Date(time);
  schedule.scheduleJob(date, async () => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Notification email sent");
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  });

  res.status(200).send("Notification email scheduled");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

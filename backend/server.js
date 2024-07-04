const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const schedule = require("node-schedule");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT;
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

app.post("/send-notification", async (req, res) => {
  const { email, time } = req.body;

  // Configure the transport options
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Notification Setup",
    html: `<div style="background-color: green">
    <h1> Greetings from <strong><italic>REVISTER</italic></strong></h1>
    <p>Time to revisit those problems!</p>
  </div>`,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response); // Log the response
    res.status(200).send("Notification email sent");
  } catch (error) {
    console.error("Error sending email: ", error); // Log the error
    res.status(500).send("Error sending email: " + error.message);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

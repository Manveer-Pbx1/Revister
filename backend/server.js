const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const schedule = require("node-schedule");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
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
    subject: "Time to REVISIT with REVISTER",
    html: `
    <div style="padding: 24px">
    <h1>Time to get <strong><i>CONSISTENT</i></strong> and <strong><i>DISCIPLINED.</i></strong></h1>
    <br/>
    <img src="https://images.pexels.com/photos/330771/pexels-photo-330771.jpeg?auto=compress&cs=tinysrgb&w=600" style = "height: 300px; width: 100%; background-size: cover; background-position: center; background-repeat: no-repeat;"/>

    <a href = "https://revister-getconsistent.vercel.app/"> Revisit problems </a>
            </div>
            `,
  };

  // Schedule the email
  const date = new Date(time);
  schedule.scheduleJob(date, async () => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Notification email sent", mailOptions);
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  });

  res.status(200).send("Notification email scheduled");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

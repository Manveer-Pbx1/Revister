const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/send-notification', async (req, res) => {
  const { email, time } = req.body;

  // Configure the transport options
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'manveer7saggu@gmail.com',
      pass: 'enia dsxp xsvb exkv',
    },
  });

  // Define email options
  let mailOptions = {
    from: 'manveer7saggu@gmail.com',
    to: email,
    subject: 'Notification Setup',
    text: `You are required to revisit your problems! ${time}.`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notification email sent');
  } catch (error) {
    res.status(500).send('Error sending email: ' + error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

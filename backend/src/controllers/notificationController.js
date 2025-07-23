const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const NotificationSubscription = require('../models/notificationSubscription');

// Store active jobs to manage them later
const activeJobs = new Map();

exports.sendNotification = async (req, res) => {
  try {
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
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

    schedule.scheduleJob(utcDate, async () => {
      console.log("Scheduled job triggered at:", new Date());
      try {
        await transporter.sendMail(mailOptions);
        console.log("Notification email sent to:", email);
      } catch (error) {
        console.error("Error sending scheduled email:", error);
      }
    });

    console.log("Notification email scheduled for:", utcDate);
    res.status(200).send("Notification email scheduled");
  } catch (error) {
    console.error("Error scheduling notification:", error);
    res.status(500).send("Internal server error");
  }
};

exports.setupRecurringNotification = async (req, res) => {
  try {
    const { email, frequency } = req.body;

    if (!email || !frequency) {
      return res.status(400).send("Email and frequency are required");
    }

    // Cancel existing job for this email if any
    if (activeJobs.has(email)) {
      activeJobs.get(email).cancel();
      activeJobs.delete(email);
    }

    // Save or update subscription in database
    const [subscription, created] = await NotificationSubscription.upsert({
      email,
      frequency,
      isActive: true
    });

    console.log(created ? 'Created new subscription' : 'Updated existing subscription', 'for:', email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
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

    let cronExpression;
    let description;

    switch (frequency) {
      case 'daily':
        cronExpression = '0 9 * * *'; // Every day at 9 AM
        description = 'daily at 9 AM';
        break;
      case 'twice-weekly':
        cronExpression = '0 9 * * 1,4'; // Monday and Thursday at 9 AM
        description = 'twice a week (Monday & Thursday at 9 AM)';
        break;
      case 'weekly':
        cronExpression = '0 9 * * 1'; // Every Monday at 9 AM
        description = 'weekly on Monday at 9 AM';
        break;
      case 'monthly':
        cronExpression = '0 9 1 * *'; // 1st of every month at 9 AM
        description = 'monthly on the 1st at 9 AM';
        break;
      default:
        return res.status(400).send("Invalid frequency option");
    }

    console.log(`Setting up ${frequency} notifications for ${email} with cron: ${cronExpression}`);

    const job = schedule.scheduleJob(cronExpression, async () => {
      console.log(`Sending recurring notification to ${email} at:`, new Date());
      try {
        await transporter.sendMail(mailOptions);
        console.log("Recurring notification email sent to:", email);
        
        // Update lastSent timestamp
        await NotificationSubscription.update(
          { lastSent: new Date() },
          { where: { email, isActive: true } }
        );
      } catch (error) {
        console.error("Error sending recurring email:", error);
      }
    });

    // Store the job reference
    activeJobs.set(email, job);

    console.log(`Recurring notification scheduled for ${email} - ${description}`);
    res.status(200).send(`Recurring notifications set up ${description}`);
  } catch (error) {
    console.error("Error setting up recurring notification:", error);
    res.status(500).send("Internal server error");
  }
};

exports.cancelRecurringNotification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    // Cancel the scheduled job
    if (activeJobs.has(email)) {
      activeJobs.get(email).cancel();
      activeJobs.delete(email);
    }

    // Update database to mark as inactive
    const updated = await NotificationSubscription.update(
      { isActive: false },
      { where: { email } }
    );

    if (updated[0] > 0) {
      console.log(`Recurring notification cancelled for: ${email}`);
      res.status(200).send("Recurring notification cancelled successfully");
    } else {
      res.status(404).send("No recurring notification found for this email");
    }
  } catch (error) {
    console.error("Error cancelling recurring notification:", error);
    res.status(500).send("Internal server error");
  }
};

// Function to restore active notifications on server restart
exports.restoreActiveNotifications = async () => {
  try {
    const activeSubscriptions = await NotificationSubscription.findAll({
      where: { isActive: true }
    });

    console.log(`Restoring ${activeSubscriptions.length} active notification subscriptions...`);

    for (const subscription of activeSubscriptions) {
      const { email, frequency } = subscription;
      
      // Set up the transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
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

      let cronExpression;
      switch (frequency) {
        case 'daily':
          cronExpression = '0 9 * * *';
          break;
        case 'twice-weekly':
          cronExpression = '0 9 * * 1,4';
          break;
        case 'weekly':
          cronExpression = '0 9 * * 1';
          break;
        case 'monthly':
          cronExpression = '0 9 1 * *';
          break;
        default:
          console.error(`Invalid frequency for ${email}: ${frequency}`);
          continue;
      }

      const job = schedule.scheduleJob(cronExpression, async () => {
        console.log(`Sending recurring notification to ${email} at:`, new Date());
        try {
          await transporter.sendMail(mailOptions);
          console.log("Recurring notification email sent to:", email);
          
          await NotificationSubscription.update(
            { lastSent: new Date() },
            { where: { email, isActive: true } }
          );
        } catch (error) {
          console.error("Error sending recurring email:", error);
        }
      });

      activeJobs.set(email, job);
      console.log(`Restored ${frequency} notifications for: ${email}`);
    }
  } catch (error) {
    console.error("Error restoring active notifications:", error);
  }
}; 
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/send-notification', notificationController.sendNotification);
router.post('/setup-recurring-notification', notificationController.setupRecurringNotification);
router.post('/cancel-recurring-notification', notificationController.cancelRecurringNotification);

module.exports = router; 
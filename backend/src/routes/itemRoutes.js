const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.post('/save-url', itemController.saveUrl);
router.get('/saved-urls', itemController.getAllUrls);
router.put('/update-url/:id', itemController.updateUrl);

module.exports = router; 
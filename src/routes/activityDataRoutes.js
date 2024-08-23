// src/routes/activityDataRoutes.js
const express = require('express');
const router = express.Router();
const activityDataController = require('../controllers/activityDataController');

// Define your routes
router.get('/', activityDataController.getAllActivityData);
router.post('/', activityDataController.createActivityData);
router.get('/:id', activityDataController.getActivityDataById);
router.put('/:id', activityDataController.updateActivityData);
router.delete('/:id', activityDataController.deleteActivityData);

module.exports = router;

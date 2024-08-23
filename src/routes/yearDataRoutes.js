const express = require('express');
const router = express.Router();
const yearController = require('../controllers/yearDataController');

router.post('/years', yearController.createYear);
router.get('/years', yearController.getAllYears);
router.get('/years/:id', yearController.getYearById);
router.put('/years/:id', yearController.updateYear);
router.delete('/years/:id', yearController.deleteYear);

module.exports = router;

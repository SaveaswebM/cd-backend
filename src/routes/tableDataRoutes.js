// src/routes/tableDataRoutes.js
const express = require('express');
const router = express.Router();
const tableDataController = require('../controllers/tableDataController');

// Define your routes
router.get('/', tableDataController.getAllTableData);
router.post('/', tableDataController.createTableData);
router.get('/:id', tableDataController.getTableDataById);
router.put('/:id', tableDataController.updateTableData);
router.delete('/:id', tableDataController.deleteTableData);

module.exports = router;

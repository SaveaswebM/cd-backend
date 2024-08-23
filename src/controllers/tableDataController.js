// src/controllers/tableDataController.js
const prisma = require('../../prismaClient'); // Import your Prisma client

// Get all TableData
exports.getAllTableData = async (req, res) => {
  try {
    const tableData = await prisma.tableData.findMany({
      include: {
        activityData: true, // Include related data if needed
      },
    });
    res.json(tableData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new TableData
exports.createTableData = async (req, res) => {
  try {
    const { activityId, dueDate, completed, completedBy, preferredDate } = req.body;
    const newTableData = await prisma.tableData.create({
      data: {
        activityData: { connect: { id: activityId } },
        dueDate,
        completed,
        completedBy,
        preferredDate,
      },
    });
    res.status(201).json(newTableData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get TableData by ID
exports.getTableDataById = async (req, res) => {
  try {
    const tableData = await prisma.tableData.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        activityData: true, // Include related data if needed
      },
    });
    if (!tableData) {
      return res.status(404).json({ error: 'TableData not found' });
    }
    res.json(tableData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update TableData by ID
exports.updateTableData = async (req, res) => {
  try {
    const { activityId, dueDate, completed, completedBy, preferredDate } = req.body;
    const updatedTableData = await prisma.tableData.update({
      where: { id: parseInt(req.params.id) },
      data: {
        activityData: { connect: { id: activityId } },
        dueDate,
        completed,
        completedBy,
        preferredDate,
      },
    });
    res.json(updatedTableData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete TableData by ID
exports.deleteTableData = async (req, res) => {
  try {
    await prisma.tableData.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

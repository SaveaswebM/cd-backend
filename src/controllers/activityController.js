// src/controllers/activityDataController.js
const prisma = require('../../prismaClient'); // Import your Prisma client

// Create a new Activity
exports.createActivity = async (req, res) => {
    try {
        const { name, type } = req.body;
        const newActivity = await prisma.activity.create({
            data: {
                name,
                type,
            },
        });
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Activities
exports.getAllActivities = async (req, res) => {
    try {
        const activities = await prisma.activity.findMany();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Activity by ID
exports.getActivityById = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await prisma.activity.findUnique({
            where: { id: parseInt(id) },
        });
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an Activity by ID
exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type } = req.body;
        const updatedActivity = await prisma.activity.update({
            where: { id: parseInt(id) },
            data: {
                name,
                type,
            },
        });
        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an Activity by ID
exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.activity.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

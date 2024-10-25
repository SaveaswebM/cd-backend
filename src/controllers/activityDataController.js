
const prisma = require('../../prismaClient');

// Get all ActivityData
exports.getAllActivityData = async (req, res) => {
    try {
        const activityData = await prisma.activityData.findMany({
            include: {
                activity: true, // Include related activity data if needed
                year: true, // Include related year data if needed
            },
        });
        res.json(activityData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new ActivityData
exports.createActivityData = async (req, res) => {
    try {
        const { taskName, type, yearId, month, dueDate, activityId, quarterlyTypeId } = req.body;

        // Prepare the data object
        const data = {
            taskName,
            type,
            year: { connect: { id: yearId } },

            dueDate,
            activity: { connect: { id: activityId } },
        };
        if (month) {
            data.month = month
        }
        // Add quarterlyType only if quarterlyTypeId is provided
        if (quarterlyTypeId) {
            data.quarterlyType = { connect: { id: quarterlyTypeId } };
        }

        // Create the new ActivityData
        const newActivityData = await prisma.activityData.create({
            data,
        });

        res.status(201).json(newActivityData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get ActivityData by ID
exports.getActivityDataById = async (req, res) => {
    try {
        const activityData = await prisma.activityData.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                activity: true, // Include related activity data if needed
                year: true, // Include related year data if needed
            },
        });
        if (!activityData) {
            return res.status(404).json({ error: 'ActivityData not found' });
        }
        res.json(activityData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update ActivityData by ID
exports.updateActivityData = async (req, res) => {
    try {
        const { taskName, type, dueDate, yearId, month, activityId } = req.body;

        const data = {};

        if (taskName != undefined) {
            data.taskName = taskName;
        }
        if (type != undefined) {
            data.type = type;
        }
        if (yearId != undefined) {
            data.year = { connect: { id: yearId } };
        }
        if (month != undefined) {
            data.month = month;
        }
        if (dueDate != undefined) {
            data.dueDate = dueDate;
        }
        if (activityId != undefined) {
            data.activity = { connect: { id: activityId } };
        }
        const updatedActivityData = await prisma.activityData.update({
            where: { id: parseInt(req.params.id) },
            data,
        })
        res.json(updatedActivityData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete ActivityData by ID
exports.deleteActivityData = async (req, res) => {
    try {
        await prisma.activityData.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

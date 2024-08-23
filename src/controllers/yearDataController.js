const prisma = require('../../prismaClient'); // Import your Prisma client


// Create a new Year
exports.createYear = async (req, res) => {
    try {
        const { year } = req.body;
        const newYear = await prisma.year.create({
            data: {
                year,
            },
        });
        res.status(201).json(newYear);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Years
exports.getAllYears = async (req, res) => {
    try {
        const years = await prisma.year.findMany();
        res.status(200).json(years);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Year by ID
exports.getYearById = async (req, res) => {
    try {
        const { id } = req.params;
        const year = await prisma.year.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (!year) {
            return res.status(404).json({ error: 'Year not found' });
        }
        res.status(200).json(year);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Year by ID
exports.updateYear = async (req, res) => {
    try {
        const { id } = req.params;
        const { year } = req.body;
        const updatedYear = await prisma.year.update({
            where: { id: parseInt(id, 10) },
            data: { year },
        });
        res.status(200).json(updatedYear);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Year by ID
exports.deleteYear = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedYear = await prisma.year.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(200).json(deletedYear);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const express = require("express");

const prisma = require("../../prismaClient");

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    link, // Link URL (should be unique)
    data // The incoming data object
  } = req.body;

  // Ensure the required fields are provided
  if (!link) {
    return res.status(400).json({
      error: "Missing required field: link is required."
    });
  }

  try {
    // Check if the link already exists
    const existingLink = await prisma.link.findUnique({
      where: { link: link }
    });

    if (existingLink) {
      // If the link exists, merge the new data with the existing data
      const updatedData = { ...existingLink.data };

      // Iterate over incoming data keys to update or add them
      Object.keys(data).forEach((key) => {
        if (updatedData[key]) {
          // Key exists, merge arrays
          updatedData[key] = [...updatedData[key], ...data[key]];
        } else {
          // Key doesn't exist, add new entry
          updatedData[key] = data[key];
        }
      });

      // Update the link with the merged data
      const updatedLink = await prisma.link.update({
        where: { link: link },
        data: { data: updatedData }
      });

      return res.status(200).json({
        message: "Link data updated successfully",
        link: updatedLink
      });
    } else {
      // If the link does not exist, create a new entry
      const newLink = await prisma.link.create({
        data: {
          link,
          data: data || {} // Optional data, defaults to an empty object if not provided
        }
      });

      return res.status(201).json({
        message: "Link created successfully",
        link: newLink
      });
    }
  } catch (error) {
    console.error("Error creating/updating link:", error);
    return res.status(500).json({
      error: "An error occurred while creating/updating the link."
    });
  }
});


// Get a Link by 'link' or search by other parameters
router.get("/", async (req, res) => {
  const { link } = req.query; // Query parameters from the request

  try {
    // If `link` is provided, fetch the specific link
    if (link) {
      const linkData = await prisma.link.findUnique({
        where: { link: link }
      });

      if (!linkData) {
        return res.status(404).json({
          message: "Link not found"
        });
      }

      return res.status(200).json(linkData);
    }
  } catch (error) {
    console.error("Error fetching links:", error);
    return res.status(500).json({
      error: "An error occurred while fetching links"
    });
  }
});

module.exports = router;

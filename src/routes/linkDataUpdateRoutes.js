const express = require("express");

const prisma = require("../../prismaClient");

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    link, // Link URL (should be unique)
    linkownerName, // Name of the owner
    linkrecieverName, // Name of the receiver
    companyName, // Company name
    activities, // Array of activities
    data // Additional JSON data (optional)
  } = req.body;

  // Ensure the required fields are provided
  if (
    !link ||
    !linkownerName ||
    !linkrecieverName ||
    !companyName ||
    !activities
  ) {
    return res.status(400).json({
      error:
        "Missing required fields: link, linkownerName, linkrecieverName, companyName, and activities are required."
    });
  }

  try {
    // Create a new link entry using Prisma
    const newLink = await prisma.link.create({
      data: {
        link,
        linkownerName,
        linkrecieverName,
        companyName,
        activities,
        data: data || {} // Optional data, defaults to an empty object if not provided
      }
    });

    // Return the newly created link entry
    return res.status(201).json({
      message: "Link created successfully",
      link: newLink
    });
  } catch (error) {
    console.error("Error creating link:", error);
    return res.status(500).json({
      error: "An error occurred while creating the link."
    });
  }
});

// Get a Link by 'link' or search by other parameters
router.get("/", async (req, res) => {
  const { link, linkownerName, linkrecieverName, companyName } = req.query; // Query parameters from the request

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

    // If `link` is not provided, search by the other fields
    const links = await prisma.link.findMany({
      where: {
        linkownerName: linkownerName ? { contains: linkownerName } : undefined,
        linkrecieverName: linkrecieverName
          ? { contains: linkrecieverName }
          : undefined,
        companyName: companyName ? { contains: companyName } : undefined
      }
    });

    if (links.length === 0) {
      return res.status(404).json({
        message: "No links found"
      });
    }

    return res.status(200).json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    return res.status(500).json({
      error: "An error occurred while fetching links"
    });
  }
});

module.exports = router;

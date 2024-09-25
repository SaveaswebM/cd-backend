const express = require("express");

const prisma = require("../../prismaClient");

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    link, // Link URL (should be unique)
    owner,
    companyName,
    activityName,
    employeeName,
    data // The incoming data object
  } = req.body;

  // Ensure the required fields are provided
  if (!link) {
    return res.status(400).json({
      error: "Missing required field: link is required."
    });
  }
  if (!companyName || !activityName || !employeeName) {
    return res.status(400).json({
      error: "Missing activity data"
    });
  }

  try {
    // Check if the link already exists
    const existingLink = await prisma.link.findUnique({
      where: { link: link }
    });

    if (existingLink) {
      // If the link exists, fetch and modify recievers
      let recievers = existingLink.recievers || {};

      // Check if the employeeName exists
      if (!recievers[employeeName]) {
        // If employee doesn't exist, create new structure for the employee
        recievers[employeeName] = {
          [companyName]: [activityName] // Add company and activityName
        };
      } else {
        // Employee exists, check if the companyName exists
        if (!recievers[employeeName][companyName]) {
          // Company doesn't exist, create the company and add the activityName
          recievers[employeeName][companyName] = [activityName];
        } else {
          // Company exists, check if the activityName exists
          if (!recievers[employeeName][companyName].includes(activityName)) {
            // Add the activityName to the company's activity list
            recievers[employeeName][companyName].push(activityName);
          } else {
            return res.status(200).json({
              message: `Activity '${activityName}' already exists for employee '${employeeName}' under company '${companyName}'`
            });
          }
        }
      }

      // Update the link's recievers and other data
      const updatedData = { ...existingLink.data, ...data }; // Merge the new data into the existing data
      const updatedLink = await prisma.link.update({
        where: { link: link },
        data: {
          recievers: recievers,
          data: updatedData // Update the data as well
        }
      });

      return res.status(200).json({
        message: "Link data and access modified successfully",
        link: updatedLink
      });
    } else {
      // If the link does not exist, create a new entry
      const newRecievers = {
        [employeeName]: {
          [companyName]: [activityName]
        }
      };

      const newLink = await prisma.link.create({
        data: {
          link,
          owner,
          recievers: newRecievers,
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


router.post("/modify-access", async (req, res) => {
  const { link, companyName, activityName, employeeName } = req.body;

  try {
    if (!link) {
      return res.status(400).json({
        message: "Link is required"
      });
    }

    const linkData = await prisma.link.findUnique({
      where: { link: link }
    });

    if (!linkData) {
      return res.status(404).json({
        message: "Link not found"
      });
    }

    let recievers = linkData.recievers || {};

    // Check if employeeName exists
    if (!recievers[employeeName]) {
      return res.status(404).json({
        message: `Employee ${employeeName} not found`
      });
    }

    // Check if companyName exists for the employee
    if (!recievers[employeeName][companyName]) {
      // Add companyName with the activityName if it doesn't exist
      recievers[employeeName][companyName] = [activityName];
    } else {
      // Check if the activityName already exists in the companyName's list
      if (!recievers[employeeName][companyName].includes(activityName)) {
        // Add the activityName to the companyName's list
        recievers[employeeName][companyName].push(activityName);
      } else {
        return res.status(200).json({
          message: `Activity ${activityName} already exists for company ${companyName}`
        });
      }
    }

    // Update the recievers in the database
    await prisma.link.update({
      where: { link: link },
      data: { recievers: recievers }
    });

    res.status(200).json({
      message: "Access modified successfully",
      updatedRecievers: recievers
    });

  } catch (error) {
    console.error("Error modifying access:", error);
    return res.status(500).json({
      error: "An error occurred while modifying access"
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

router.get("/employee-list", async (req, res) => {
  const { link } = req.query; // Use req.query for GET request
  try {
    if (link) {
      const linkData = await prisma.link.findUnique({
        where: { link: link }
      });

      if (!linkData) {
        return res.status(404).json({
          message: "Link not found"
        });
      }

      res.status(200).json(linkData.recievers); // Return recievers field
    } else {
      res.status(400).json({
        message: "Link is required"
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while fetching the link data"
    });
  }
});

module.exports = router;

require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const prismaClient = require("@prisma/client");

// Initialize the router.
const router = express.Router();

// Initialize the prisma client.
const prisma = new prismaClient.PrismaClient();

// API Route: /api/story
// Method: POST
// Function: Adds a new story into the DB.

router.post(
    "/",
    body("title", "Please enter story title!").isLength({ min: 1 }),
    body("category", "Please enter story category!").isLength({ min: 1 }),
    body("synopsis", "Please enter story synopsis!").isLength({ min: 1 }),
    body("author", "Please enter author name!").isLength({ min: 1 }),
    body("content", "Please enter story content!").isLength({ min: 1 }),
    async (req, res) => {
        // Finds the validation errors in this request and return any error message.
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ message: errors.array()[0].msg });
        }

        // Create the unique slug.
        const ms = Date.now();
        const slug = `${req.body.title}-${ms}`;

        try {
            // Build the story object.
            const story = {
                slug,
                ...req.body,
            };

            // Add the story object into database.
            await prisma.story.create({ data: story });

            // Send the response.
            return res
                .status(200)
                .json({ message: "The story is saved successfully." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;

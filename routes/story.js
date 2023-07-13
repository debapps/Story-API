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
    body("image", "Please enter story image URL!").isLength({ min: 1 }),
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

// API Route: /api/story?author=XXX
// Method: GET
// Function: Fetch all stories from the DB. We can query stories by author as well.

router.get("/", async (req, res) => {
    const { author } = req.query;

    try {
        // Get all the stories from the DB.
        const stories = await prisma.story.findMany({
            select: {
                id: true,
                slug: true,
                title: true,
                image: true,
                category: true,
                synopsis: true,
                author: true,
                content: true,
                updatedAt: true,
            },
            where: {
                author,
            },
        });

        // Sort the stories by the updatedAt, with recent stories come first.
        stories.sort((s1, s2) => {
            // Convert the updatedAt timestamps to milliseconds.
            const ms1 = Date.parse(s1.updatedAt);
            const ms2 = Date.parse(s2.updatedAt);

            // Compare the milliseconds. Sorts the stories with recent updates come first.
            if (ms1 < ms2) {
                return 1;
            } else if (ms1 > ms2) {
                return -1;
            } else {
                return 0;
            }
        });

        // Send the response.
        return res.status(200).json({ stories });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// API Route: /api/story/[slug]
// Method: GET
// Function: Fetch story specific to the slug.

router.get("/:slug", async (req, res) => {
    // Get the slug from the request parameter.
    const { slug } = req.params;

    try {
        // Get the story for the specific slug.
        const story = await prisma.story.findUnique({
            select: {
                id: true,
                slug: true,
                title: true,
                image: true,
                category: true,
                synopsis: true,
                author: true,
                content: true,
                updatedAt: true,
            },
            where: {
                slug,
            },
        });

        // Send the response.
        return res.status(200).json({ ...story });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// API Route: /api/story/[slug]
// Method: DELETE
// Function: Delete story by the slug.

router.delete("/:slug", async (req, res) => {
    // Get the slug from the request parameter.
    const { slug } = req.params;

    try {
        // Delete the story for the specific slug.
        await prisma.story.delete({
            where: {
                slug,
            },
        });

        // Send the response.
        return res.status(200).json({ message: "The story has been deleted." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;

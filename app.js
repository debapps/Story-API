require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Initializing express application.
const app = express();

// Middleware.
app.use(express.json());
app.use(cors());

// Available Routes.
app.use("/api/story", require("./routes/story"));

// Listening to the application port.
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Story API is running on ${port}`);
});

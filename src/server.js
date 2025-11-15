import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import bodyParser from "body-parser";

// Importing the .env
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // for form data
app.use(bodyParser.json()); // for JSON bodies

app.use("/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  console.log(`Server is listening on port ${port}`);
});

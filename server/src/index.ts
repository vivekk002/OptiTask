import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import UserRouter from "./routes/auth_routes/index.ts";
import ContentRouter from "./routes/content_routes/index.ts";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("OptiTask API is running!");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.use("/api/auth", UserRouter);
app.use("/api/content", ContentRouter);

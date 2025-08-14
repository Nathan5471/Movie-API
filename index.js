import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Connection Error:", error);
  });

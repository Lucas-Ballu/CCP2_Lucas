import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/users.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);

app.listen(process.env.PORT, () =>
  console.log(`API lancée sur le port ${process.env.PORT}`)
);

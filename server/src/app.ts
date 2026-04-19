import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import borrowRoutes from "./routes/borrowRoutes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/borrow", borrowRoutes);

export default app;

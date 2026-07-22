import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { initDB } from "./database/initDB.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected Route Accessed",
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Warehouse Management API Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;


 async function startServer() {
  await connectDB();
  await initDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
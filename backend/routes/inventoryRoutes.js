import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
} from "../controllers/inventoryController.js";
const router = express.Router();

// Create Inventory Transaction
router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getAllTransactions);
router.get("/:id", authMiddleware, getTransactionById);
export default router;
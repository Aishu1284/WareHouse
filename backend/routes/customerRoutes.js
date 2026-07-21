import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/", authMiddleware, createCustomer);

router.get("/", authMiddleware, getAllCustomers);

router.get("/:id", authMiddleware, getCustomerById);

router.put("/:id", authMiddleware, updateCustomer);

router.delete("/:id", authMiddleware, deleteCustomer);

export default router;
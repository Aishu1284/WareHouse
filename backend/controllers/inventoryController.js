import {sql} from "../config/db.js";

export const createTransaction = async (req, res) => {
  try {
    const { product_id, transaction_type, quantity, remarks } = req.body;
    // Validate required fields
if (!product_id || !transaction_type || !quantity) {
  return res.status(400).json({
    success: false,
    message: "Please provide product_id, transaction_type and quantity",
  });
}
// Check if product exists
const product = await sql`
  SELECT * FROM products
  WHERE id = ${product_id};
`;

if (product.length === 0) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}
// Prevent stock from going negative
if (
  transaction_type === "OUT" &&
  product[0].quantity < quantity
) {
  return res.status(400).json({
    success: false,
    message: "Insufficient stock",
  });
}
// Calculate new stock
let newQuantity;

if (transaction_type === "IN") {
  newQuantity = product[0].quantity + quantity;
} else {
  newQuantity = product[0].quantity - quantity;
}
// Update product quantity
await sql`
  UPDATE products
  SET
    quantity = ${newQuantity},
    updated_at = CURRENT_TIMESTAMP
  WHERE id = ${product_id};
`;
// Save inventory transaction
const transaction = await sql`
  INSERT INTO inventory_transactions (
    product_id,
    transaction_type,
    quantity,
    remarks
  )
  VALUES (
    ${product_id},
    ${transaction_type},
    ${quantity},
    ${remarks}
  )
  RETURNING *;
`;
    res.status(201).json({
  success: true,
  message: "Inventory transaction created successfully",
  transaction: transaction[0],
  currentStock: newQuantity,
});
 

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await sql`
      SELECT
        it.*,
        p.name AS product_name,
        p.sku
      FROM inventory_transactions it
      JOIN products p
      ON it.product_id = p.id
      ORDER BY it.created_at DESC;
    `;

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await sql`
      SELECT
        it.*,
        p.name AS product_name,
        p.sku
      FROM inventory_transactions it
      JOIN products p
      ON it.product_id = p.id
      WHERE it.id = ${id};
    `;

    if (transaction.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      transaction: transaction[0],
    });
  } catch (error) {
    console.error("Get Transaction Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
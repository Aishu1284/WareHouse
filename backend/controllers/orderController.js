import { sql } from "../config/db.js";

export const createOrder = async (req, res) => {
  try {
    const { customer_id, product_id, quantity } = req.body;

    if (!customer_id || !product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide customer_id, product_id and quantity",
      });
    }

    // Check customer
    const customer = await sql`
      SELECT * FROM customers
      WHERE id=${customer_id};
    `;

    if (customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check product
    const product = await sql`
      SELECT * FROM products
      WHERE id=${product_id};
    `;

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product[0].quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    const totalPrice = product[0].price * quantity;

    // Create Order
    const order = await sql`
      INSERT INTO orders(
        customer_id,
        product_id,
        quantity,
        total_price
      )
      VALUES(
        ${customer_id},
        ${product_id},
        ${quantity},
        ${totalPrice}
      )
      RETURNING *;
    `;

    // Update Stock
    const newQuantity = product[0].quantity - quantity;

    await sql`
      UPDATE products
      SET
      quantity=${newQuantity},
      updated_at=CURRENT_TIMESTAMP
      WHERE id=${product_id};
    `;

    // Inventory Transaction
    await sql`
      INSERT INTO inventory_transactions(
        product_id,
        transaction_type,
        quantity,
        remarks
      )
      VALUES(
        ${product_id},
        'OUT',
        ${quantity},
        'Order Placed'
      );
    `;

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: order[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await sql`
      SELECT
      o.*,
      c.name AS customer_name,
      p.name AS product_name
      FROM orders o
      JOIN customers c
      ON o.customer_id=c.id
      JOIN products p
      ON o.product_id=p.id
      ORDER BY o.created_at DESC;
    `;

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getOrderById = async (req, res) => {

  try {

    const { id } = req.params;

    const order = await sql`
      SELECT
      o.*,
      c.name AS customer_name,
      p.name AS product_name
      FROM orders o
      JOIN customers c
      ON o.customer_id=c.id
      JOIN products p
      ON o.product_id=p.id
      WHERE o.id=${id};
    `;

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order: order[0],
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};

export const deleteOrder = async (req, res) => {

  try {

    const { id } = req.params;

    const order = await sql`
      SELECT *
      FROM orders
      WHERE id=${id};
    `;

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await sql`
      DELETE FROM orders
      WHERE id=${id};
    `;

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};
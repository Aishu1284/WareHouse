import { sql } from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const products = await sql`
      SELECT COUNT(*) FROM products;
    `;

    const customers = await sql`
      SELECT COUNT(*) FROM customers;
    `;

    const orders = await sql`
      SELECT COUNT(*) FROM orders;
    `;

    const inventory = await sql`
      SELECT COALESCE(SUM(quantity),0) AS total
      FROM products;
    `;

    const revenue = await sql`
      SELECT COALESCE(SUM(total_price),0) AS revenue
      FROM orders;
    `;

    const recentOrders = await sql`
      SELECT
        o.id,
        c.name AS customer_name,
        p.name AS product_name,
        o.quantity,
        o.total_price,
        o.created_at
      FROM orders o
      JOIN customers c
      ON o.customer_id=c.id
      JOIN products p
      ON o.product_id=p.id
      ORDER BY o.created_at DESC
      LIMIT 5;
    `;

    res.json({
      success: true,
      stats: {
        products: Number(products[0].count),
        customers: Number(customers[0].count),
        orders: Number(orders[0].count),
        inventory: Number(inventory[0].total),
        revenue: Number(revenue[0].revenue),
      },
      recentOrders,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
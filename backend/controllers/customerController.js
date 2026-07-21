import { sql } from "../config/db.js";

export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    const customer = await sql`
      INSERT INTO customers (
        name,
        email,
        phone,
        address
      )
      VALUES (
        ${name},
        ${email},
        ${phone},
        ${address}
      )
      RETURNING *;
    `;

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer: customer[0],
    });
  } catch (error) {
    console.error("Create Customer Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await sql`
      SELECT *
      FROM customers
      ORDER BY created_at DESC;
    `;

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Get Customers Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await sql`
      SELECT *
      FROM customers
      WHERE id = ${id};
    `;

    if (customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      customer: customer[0],
    });
  } catch (error) {
    console.error("Get Customer Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const existingCustomer = await sql`
      SELECT *
      FROM customers
      WHERE id = ${id};
    `;

    if (existingCustomer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const updatedCustomer = await sql`
      UPDATE customers
      SET
        name = ${name},
        email = ${email},
        phone = ${phone},
        address = ${address},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer[0],
    });
  } catch (error) {
    console.error("Update Customer Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await sql`
      SELECT *
      FROM customers
      WHERE id = ${id};
    `;

    if (customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await sql`
      DELETE FROM customers
      WHERE id = ${id};
    `;

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete Customer Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
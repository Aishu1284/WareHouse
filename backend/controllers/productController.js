import { sql } from "../config/db.js";

export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, price, quantity } = req.body;

    // Validation
    if (!name || !sku || !category || !price || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }
    // Check if SKU already exists
const existingProduct = await sql`
  SELECT * FROM products
  WHERE sku = ${sku}
`;

if (existingProduct.length > 0) {
  return res.status(409).json({
    success: false,
    message: "SKU already exists",
  });
}
    // Insert Product into Database
const newProduct = await sql`
  INSERT INTO products (
    name,
    sku,
    category,
    price,
    quantity
  )
  VALUES (
    ${name},
    ${sku},
    ${category},
    ${price},
    ${quantity}
  )
  RETURNING *;
`;

res.status(201).json({
  success: true,
  message: "Product created successfully",
  product: newProduct[0],
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY id ASC;
    `;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    // Get ID from URL
    const { id } = req.params;
    
    // Search product by ID
   const product = await sql`
  SELECT * FROM products
  WHERE id = ${id};
`;
  // Check if product exists
if (product.length === 0) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}
res.status(200).json({
  success: true,
  product: product[0],
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, sku, category, price, quantity } = req.body;
     
    // Check if product exists
const existingProduct = await sql`
  SELECT * FROM products
  WHERE id = ${id};
`;

if (existingProduct.length === 0) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}
// Update product
const updatedProduct = await sql`
  UPDATE products
  SET
    name = ${name},
    sku = ${sku},
    category = ${category},
    price = ${price},
    quantity = ${quantity},
    updated_at = CURRENT_TIMESTAMP
  WHERE id = ${id}
  RETURNING *;
`;
res.status(200).json({
  success: true,
  message: "Product updated successfully",
  product: updatedProduct[0],
});
   
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
     
    // Check if product exists
const existingProduct = await sql`
  SELECT * FROM products
  WHERE id = ${id};
`;

if (existingProduct.length === 0) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}
// Delete product
await sql`
  DELETE FROM products
  WHERE id = ${id};
`; 
res.status(200).json({
  success: true,
  message: "Product deleted successfully",
});
    
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
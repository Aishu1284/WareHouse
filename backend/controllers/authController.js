import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import { sql } from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }
    const existingUser = await sql`
    SELECT * FROM users
    WHERE email = ${email}
    `;


if (existingUser.length > 0) {
  return res.status(409).json({
    success: false,
    message: "Email already registered",
  });
}
// Hash Password
const hashedPassword = await bcrypt.hash(password, 10);
const newUser = await sql`
  INSERT INTO users (name, email, password)
  VALUES (${name}, ${email}, ${hashedPassword})
  RETURNING id, name, email, role, created_at;
`;

res.status(201).json({
  success: true,
  message: "User registered successfully",
  user: newUser[0],
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Check if user exists
const user = await sql`
  SELECT * FROM users
  WHERE email = ${email}
`;

if (user.length === 0) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}
// Compare password
const isPasswordMatch = await bcrypt.compare(
  password,
  user[0].password
);

if (!isPasswordMatch) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
}
const token = generateToken(user[0].id, user[0].role);

res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user[0].id,
    name: user[0].name,
    email: user[0].email,
    role: user[0].role,
  },
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
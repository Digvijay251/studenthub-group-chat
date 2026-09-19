const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password, name, yearofstudy, program } = req.body;

  if (
    !username?.trim() ||
    !password ||
    !name?.trim() ||
    !yearofstudy ||
    !program?.trim()
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters",
    });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER($1)",
      [username.trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users
        (username, password_hash, name, yearofstudy, program)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, name, yearofstudy, program`,
      [
        username.trim(),
        passwordHash,
        name.trim(),
        String(yearofstudy),
        program.trim(),
      ]
    );

    const user = result.rows[0];
    const token = createToken(user);

    res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password) {
    return res.status(400).json({
      error: "Username and password are required",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, username, password_hash, name, yearofstudy, program
       FROM users
       WHERE LOWER(username) = LOWER($1)`,
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const account = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      account.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const user = {
      id: account.id,
      username: account.username,
      name: account.name,
      yearofstudy: account.yearofstudy,
      program: account.program,
    };

    const token = createToken(user);

    res.json({
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
    });
  }
});

module.exports = router;

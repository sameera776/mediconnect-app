const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

exports.register = (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ msg: "Hashing error", error: err });

    createUser(email, hash, (err, result) => {
      if (err) return res.status(500).json({ msg: "DB insert failed", error: err });
      res.status(201).json({ msg: "User registered successfully" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log("🚀 Login attempt for:", email);

  findUserByEmail(email, (err, results) => {
    if (err) {
      console.error("❌ DB error in findUserByEmail:", err);
      return res.status(500).json({ msg: "Internal server error" });
    }

    if (!results || results.length === 0) {
      console.warn("❌ No user found with email:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = results[0];
    console.log("✅ User found:", user.email);

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("❌ Bcrypt compare error:", err);
        return res.status(500).json({ msg: "Internal server error" });
      }

      if (!isMatch) {
        console.warn("❌ Password mismatch");
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("✅ Login successful for:", email);
      res.json({ token });
    });
  });
};

const db = require("../config/db");

exports.createUser = (email, hashedPassword, callback) => {
  const query = "INSERT INTO users (email, password) VALUES (?, ?)";
  db.query(query, [email, hashedPassword], callback);
};

exports.findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("❌ Error in findUserByEmail:", err);
      return callback(err, []);
    }

    // Log result to ensure structure is right
    console.log("✅ Query result:", results);
    callback(null, results);
  });
};

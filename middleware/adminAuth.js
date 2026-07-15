const auth = require("./auth");
const { getDB } = require("../database/db");

module.exports = [
  auth,
  (req, res, next) => {
    const db = getDB();

    const result = db.exec(
      "SELECT role FROM users WHERE id=?",
      [req.user.id]
    );

    if (!result.length || !result[0].values.length) {
      return res.status(401).json({
        success: false,
        error: "User not found"
      });
    }

    const role = result[0].values[0][0];

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin only"
      });
    }

    next();
  }
];

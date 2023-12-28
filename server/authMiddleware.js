// utils/authMiddleware.js
const admin = require("firebase-admin");

const authenticateUser = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization;
    req.user = await admin.auth().verifyIdToken(idToken);
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticateUser;

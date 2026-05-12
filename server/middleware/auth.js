const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    const userId = payload.userId != null ? Number(payload.userId) : null;
    req.user = {
      ...payload,
      userId: Number.isFinite(userId) ? userId : payload.userId,
    };
    next();
  });
};

module.exports = authenticateToken;

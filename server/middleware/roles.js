const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("authorizeRoles req.user:", req.user);
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Invalid user data' });
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action', required: allowedRoles, actual: role });
    }

    next();
  };
};

module.exports = authorizeRoles;

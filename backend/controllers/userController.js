const User = require("../models/User");

async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.auth.sub).select("email name");
    if (!user) return res.status(401).json({ success: false, message: "User no longer exists." });
    return res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getCurrentUser };

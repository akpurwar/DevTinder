const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send("Unauthorized user");
    }

    const decodedToken = jwt.verify(token, "DevTinder@790");
    const isAdmin = decodedToken?.role === "admin";

    if (!isAdmin) {
      return res.status(403).send("Forbidden: admin access required");
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new Error("Token required");
    }

    const decodedToken = jwt.verify(token, "DevTinder@790");
    const { _id } = decodedToken;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("error " + err.message);
  }
};

module.exports = { adminAuth, userAuth };

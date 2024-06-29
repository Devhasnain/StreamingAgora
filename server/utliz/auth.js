const User = require("../models/Users");
const JWT = require("jsonwebtoken");
const { ErrorHandler } = require("./ResponseHandler");
require("dotenv").config();

const checkDuplicateEmail = async (req, res, next) => {
  try {
    let { email } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ msg: "Email is already in use." });
    }

    next();
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(400).json({ msg: "Bad request" });
    }

    let { _id } = JWT.verify(token, process.env.JWT_SECRET);

    if (!_id) {
      return res.status(401).json({ msg: "Authentication fail." });
    }

    let user = await User.findById(_id).select(["-password"]);

    req.user = user;
    next();
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

const socketMiddleware = async (socket, next) => {
  const token = socket.handshake.query.token;
  try {
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const { _id } = JWT.verify(token, process.env.JWT_SECRET);
    if (!_id) {
      return next(new Error("Authentication error"));
    }
    let user = await User.findOne({ _id: _id })
      .select("-password")
      .lean()
      .exec();
    if (!user) {
      return next(new Error("User not found"));
    }
    next();
  } catch (error) {
    return next(new Error("Authentication middleware error"));
  }
};

module.exports = {
  checkDuplicateEmail,
  verifyToken,
  socketMiddleware,
};

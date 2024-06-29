const User = require("../models/Users.js");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { ResHandler, ErrorHandler } = require("../utliz/ResponseHandler.js");
const DeviceToken = require("../models/DeviceToken.js");
const firebaseAdmin = require("../utliz/firebase.js");
require("dotenv").config();

const Login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Bad request! All fields are required." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found with this email" });
    }

    let matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({ msg: "Incorrect email or password" });
    }

    let token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET);

    let payload = {
      token,
    };

    return ResHandler(payload, req, res);
  } catch (error) {
    console.log(error);
    return ErrorHandler(error, req, res);
  }
};

const SignUp = async (req, res) => {
  try {
    let data = req.body;

    let password = await bcrypt.hash(data.password, 12);

    let user = await User.create({
      ...data,
      password,
    });

    let token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET);

    let payload = {
      token,
    };

    return ResHandler(payload, req, res);
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

const RefreshToken = async (req, res) => {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      return res.status(400).json({ msg: "Bad request" });
    }

    let { _id } = JWT.verify(token, process.env.JWT_SECRET);

    if (!_id) {
      return res.status(401).json({ msg: "Authentiction faild." });
    }

    let user = await User.findById(_id).select(["-password"]);

    if (!user) {
      return res.status(400).json({ msg: "Bad request" });
    }

    let payload = {
      user,
    };

    return ResHandler(payload, req, res);
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

const SetDeviceToken = async (req, res) => {
  try {
    let { token } = req.body;
    let user = req.user;

    let findDevice = await DeviceToken.findOne({ user: user?._id });

    if (!findDevice) {
      await DeviceToken.create({
        user: user._id,
        token,
      });

      return res.status(200).json({ success: true });
    }

    findDevice.token = token;
    await findDevice.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

const SendCallNotification = async (req, res) => {
  try {
    let { receiptId, channelName } = req.body;
    let user = req.user;

    console.log(receiptId, channelName);

    console.log(user);
    let receiptUser = await DeviceToken.findOne({ user: receiptId });

    console.log(receiptUser);
    let payload = {
      notification: {
        title: "Incomming call",
        body: `${user?.name} is calling you.`,
      },
      data: {
        channelName:channelName,
        name: user?.name?.toString(),
        callerId: user?._id?.toString(),
        callType: "incoming",
        type: "call",
      },
      token: receiptUser.token,
    };

    firebaseAdmin
      .messaging()
      .send(payload)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  } catch (error) {
    console.log(error);
    return ErrorHandler(error, req, res);
  }
};

module.exports = {
  Login,
  SignUp,
  RefreshToken,
  SetDeviceToken,
  SendCallNotification,
};

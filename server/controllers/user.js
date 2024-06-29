const Conversation = require("../models/Conversation.js");
const User = require("../models/Users.js");
const { ErrorHandler, ResHandler } = require("../utliz/ResponseHandler");

const SearchUsers = async (req, res) => {
  try {
    let { search } = req.params;

    console.log(search);

    if (!search) {
      throw new Error("Query Parameter required.");
    }

    const regex = new RegExp(search, "i");
    let users = await User.find({ name: { $regex: regex } }).select([
      "-password",
      "-__v",
    ]);

    return ResHandler({ users }, req, res);
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

const GetUsers = async (req, res) => {
  try {
    let user = req.user;
    let users = await User.find({ _id: { $ne: user._id } }).select([
      "-password",
    ]);
    return ResHandler({ users }, req, res);
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

const GetConversation = async (req,res)=>{
  try {
    let {id} = req.params
    let user = req.user;
    let conversation = await Conversation.findOne({
      users: { $all: [user._id, id] },
    }).populate({
      path:"messages.sender",
      select:"_id name email"
    });

    return ResHandler({ conversation }, req, res);

  } catch (error) {
    return ErrorHandler(error, req, res);
  }
}

module.exports = {
  SearchUsers,
  GetUsers,
  GetConversation
};

const Conversation = require("../models/Conversation.js");
const OnlineUsers = require("../models/OnlineUsers.js");

const insertChatHistory = async ({ from, to, content }) => {
  try {
    let conversation = await Conversation.findOne({
      users: { $all: [from, to] },
    });

    if (!conversation) {
      conversation = new Conversation();
    }
    conversation.users = [from, to];
    conversation.messages.push({ sender: from, content });
    await conversation.save();

    const updatedConversation = await Conversation.findById(conversation._id).populate({
      path: 'messages.sender',
      select: '_id name email'
    });

    const latestMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    return latestMessage
  } catch (error) {
    throw error;
  }
};

const setUserOnline = async ({ userId, socketId }) => {
  try {
    let user = await OnlineUsers.findOne({ user: userId });

    if (user) {
      console.log(user?._id)
      user.socketId = socketId;
      await user.save();
      return;
    }

    await OnlineUsers.create({
      user: userId,
      socketId,
    });
  } catch (error) {
    throw error;
  }
};

const setUserOffline = async ({ socketId }) => {
  try {
    let user = await OnlineUsers.findOne({ socketId });

    console.log(user?._id)

    if (!user) {
      return;
    }

    await OnlineUsers.findByIdAndDelete(user?._id);
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const getUserSocketId = async ({ userId }) => {
  try {
    let user = await OnlineUsers.findOne({ user: userId });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertChatHistory,
  setUserOnline,
  setUserOffline,
  getUserSocketId,
};

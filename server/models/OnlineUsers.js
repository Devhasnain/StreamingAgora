const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const onlineUsersSchema = new Schema({
  user: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  socketId: {
    type: String,
  },
});

const OnlineUsers = mongoose.model("OnlineUser", onlineUsersSchema);

module.exports = OnlineUsers;

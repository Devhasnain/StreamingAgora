const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceTokenSchema = new Schema({
  user: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  token: {
    type: String,
  },
});

const DeviceToken = mongoose.model("DeviceToken", DeviceTokenSchema);

module.exports = DeviceToken;

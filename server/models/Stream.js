const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const streamSchema = new Schema(
  {
    // user: {
    //   ref: 'User',
    //   type: Schema.Types.ObjectId,
    // },

    uid: {type: String},
    channel_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Stream = mongoose.model('Stream', streamSchema);

module.exports = Stream;

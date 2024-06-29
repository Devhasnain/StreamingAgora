const Stream = require('../models/Stream');
const {ErrorHandler} = require('../utliz/ResponseHandler');
const firebaseAdmin = require('../utliz/firebase');

const GetStreams = async (req, res) => {
  try {
    let streams = await Stream.find({});
    let liveStreams = await Promise.all(
      streams.map(async item => {
        try {
          let user = (await firebaseAdmin.auth().getUser(item?.uid)).toJSON();
          return {
            ...item.toObject(),
            user: {
              name: user?.displayName,
              email: user.email,
              photoURL: user?.photoURL,
              phoneNumber: user?.phoneNumber,
              uid: user?.uid,
            },
          };
        } catch (error) {
          console.error(
            `Failed to fetch user data for UID: ${item?.uid}`,
            error,
          );
          return {...item.toObject(), user: null};
        }
      }),
    );

    return res.status(200).json({liveStreams});
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

const AddStream = async (req, res) => {
  try {
    await Stream.create(req.body);
    return res.status(200).json({success: true});
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

const DeleteStream = async (req, res) => {
  try {
    let {id} = req.params;
    await Stream.findByIdAndDelete(id);
    return res.status(200).json({success: true});
  } catch (error) {
    return ErrorHandler(error, req, res);
  }
};

module.exports = {
  GetStreams,
  AddStream,
  DeleteStream,
};

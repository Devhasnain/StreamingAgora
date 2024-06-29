const {Router} = require('express');
const {
  Login,
  SignUp,
  RefreshToken,
  SetDeviceToken,
  SendCallNotification,
} = require('./controllers/auth.js');
const {checkDuplicateEmail, verifyToken} = require('./utliz/auth.js');
const {
  SearchUsers,
  GetUsers,
  GetConversation,
} = require('./controllers/user.js');
const {
  GetStreams,
  AddStream,
  DeleteStream,
} = require('./controllers/stream.js');

const router = Router();

router.post('/login', Login);
router.post('/register', checkDuplicateEmail, SignUp);
router.get('/refresh', RefreshToken);
router.get('/users/:search', SearchUsers);
router.get('/users/', verifyToken, GetUsers);
router.get('/get/chat/:id', verifyToken, GetConversation);
router.put('/set-device-token', verifyToken, SetDeviceToken);
router.post('/send-call-notification', verifyToken, SendCallNotification);
router.get('/streams', GetStreams);
router.post('/add-stream', AddStream);
router.put('/end-stream', DeleteStream);

module.exports = router;

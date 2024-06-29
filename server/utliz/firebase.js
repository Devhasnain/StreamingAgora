const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./firebase-services-keys.json");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

module.exports = firebaseAdmin
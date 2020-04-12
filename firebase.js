const admin = require("firebase-admin");
const config = require("./settings/config.json");
var serviceAccount = require("./settings/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebase_url
});


const database = admin.database();

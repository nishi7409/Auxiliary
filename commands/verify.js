const snekfetch = require("snekfetch");
const admin = require("firebase-admin");
var serviceAccount = require("../settings/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: client.config.firebase_url
});

var db = admin.database();


exports.run = async (client, message, args) => {

	// if no username is provided, error and delete message
	if (!args[1]) return message.channel.send(`You must provide me with a ROBLOX username\n**${client.config.prefix}verify ROBLOX**`);

	db.ref(`verified_users/${message.author.id}`).set({
		"rblx_id": Number(123123)
	});


};

exports.info = {
    name: 'verify',
    usage: 'verify <rblx_username>',
    description: "Link a user's Discord account with their ROBLOX account"
};
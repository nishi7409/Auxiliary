const axios = require("axios");
const admin = require("firebase-admin");

exports.run = async (client, message, args) => {

	if (message.author.id !== client.config.owner_id) return message.channel.send(`Sorry ${message.author}, but only the owner of this bot can run that command!`);

	var discord_user_id = args[1].substring(3, args[1].length -1);
	var in_db = true;
	var status_in_db = true;
	var rblxID;
	var total_clients;

	var db = admin.database();

	// check if user is in database or if user isn't
	await axios.get(`${client.config.firebase_url}/whitelisted/${discord_user_id}.json`)
		.then(function (response) {
			if (response.data == null){
				// user not previously whitelisted
				in_db = false;
			}else if (response.data.status == false){
				// user is in database but status is false
				status_in_db = false;
				rblxID = response.data.rblx_id
			}else if (response.data.status == true){
				// user is in database but status is already true
				status_in_db = true;
				rblxID = response.data.rblx_id
			}
		});


	if (!in_db || !status_in_db){
		// user not previously whitelisted OR user is in database but status is false

		if (!in_db){

			var verifiedStatus = true;
			await axios.get(`${client.config.firebase_url}/verified_users/${discord_user_id}.json`)
				.then(function (response) {
					if (response.data == null){
						verifiedStatus = false;
					}else{
						rblxID = response.data.rblx_id;
					}
				})

			if (verifiedStatus == false){
				return message.channel.send(`<@${discord_user_id}> **must** verify themself first before the user can be whitelisted!`);
			}

			await axios.get(`${client.config.firebase_url}/default_settings/client_total.json`)
				.then(function (response) {
					total_clients = response.data;
				})

			db.ref(`whitelisted/${discord_user_id}`).set({
				rblx_id: Number(rblxID),
				status: true
			});

			db.ref(`default_settings`).set({
				client_total: Number(total_clients+1)
			});

			return message.channel.send(`Whitelisted <@${discord_user_id}>!`)
		}else{
			db.ref(`whitelisted/${discord_user_id}`).set({
				rblx_id: Number(rblxID),
				status: true
			});
			
			await axios.get(`${client.config.firebase_url}/default_settings/client_total.json`)
				.then(function (response) {
					total_clients = response.data;
				})

			db.ref(`default_settings`).set({
				client_total: Number(total_clients+1)
			});
			
			return message.channel.send(`Re-whitelisted <@${discord_user_id}>!`)
		}
	}else{
		return message.channel.send(`<@${discord_user_id}> is already whitelisted!\n**<https://www.roblox.com/users/${rblxID}/profile>**`);
	}
};

exports.info = {
    name: 'list',
    usage: 'lisit <@mention>',
    description: "Whitelists (guild) owners to use the service in their guild"
};
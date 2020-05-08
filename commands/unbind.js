const axios = require("axios");
const Discord = require("discord.js");
const admin = require("firebase-admin");

exports.run = async (client, message, args) => {
	var db = admin.database();

	// command can't be ran in dms
	if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`).then(message => message.delete({timeout: 5000, reason: "delete"}));

	// only the guild owner can run the command
	if (message.author.id !== message.guild.owner.id) return message.channel.send(`Sorry ${message.author}, but only the guild owner can the **bind** command!`).then(message => message.delete({timeout: 5000, reason: "delete"}));

	
	var setup = true;

	// check if guild is already setup
	await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}.json`)
		.then(function (response) {
			if (response.data == null){
				setup = false;
			}
		})

	if (setup == true){
		await message.channel.send(`Removing settings from database, I'll let you know when I'm done...`);

		db.ref(`guilds/${message.guild.id}/guild_settings`).set({
			group_id: Number(-1),
			group_name: -1,
			owner_id: Number(-1),
			premium: false
		});

		return message.channel.send(`Hey ${message.author}, I've successfully removed the previously binded information from my database.  **Feel free to rebind** :)`).then(message => message.delete({timeout: 5000, reason: "delete"}));
	}else{
		return message.channel.send(`Sorry ${message.author}, but this guild hasn't been binded yet--so essentially, you could say you've *successfully* unbinded this guild from a group...`).then(message => message.delete({timeout: 5000, reason: "delete"}));
	}

	// check if user is whitelisted
	// check if user is verified
	// backs up all data, returns it as a csv/json file both in the guild the owner is in AND auxillary's server
	// deletes all data from database

};

exports.info = {
    name: 'verify',
    usage: 'verify <rblx_username>',
    description: "Link a user's Discord account with their ROBLOX account"
};

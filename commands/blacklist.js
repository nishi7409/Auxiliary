const axios = require('axios');
const Discord = require("discord.js");
const admin = require("firebase-admin");
const rblxFunctions = require("noblox.js");

exports.run = async (client, message, args, groupID) => {
	var db = admin.database();
	// command can only be ran in guild text channels
	if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`)
	if (!args[1]) {
		// Blacklist can be viewed by anyone
		const response = await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}/blacklist.json`)
			var blacklistEmbed = new Discord.MessageEmbed()
			.setColor(0x21ff7a)
			.setTitle("Blacklisted Users")
			.setDescription(`These users are not allowed at any events.`)
            for (var key in response.data){
                if (response.data.hasOwnProperty(key)) {
					// user_id, blacklist description, discordId
					await axios.get(`https://api.roblox.com/users/`+key)
					.then(function (usernameResponse) {
						if (response.data.errors == null) {
							blacklistEmbed.addField(usernameResponse.data.Username + " ("+ usernameResponse.data.Id + ")", "Reason: " + response.data[key].description)
						}
					});
                }
			}
			return message.channel.send(blacklistEmbed)
    
	} else if (args[1].toLowerCase() == "add" || args[1].toLowerCase() == "remove") {
		// only users with the specified high command role can run this variation
		if (!message.member.roles.cache.some(role => role.name === `${client.config.high_command_role}`)){
			return message.channel.send(`Sorry ${message.author}, but only users with the **${client.config.high_command_role}** role can run that command!`)
		};

		if (args[1].toLowerCase() == "add") {
			// Command handling for adding people to the blacklist
			if (!args[2]) {
				return message.channel.send(`Please provide a username for your second argument!`)
			}
			if (!args[3]) {
				return message.channel.send(`Please provide a blacklist description!`)
			}
			var descriptionSet = ""
			for (var key in args) {
				if (key > 2) {
					descriptionSet += (args[key] + " ")
				}	
			}

			var rblx_username
			var rblx_id

			var flag = true

			await axios.get(`https://api.roblox.com/users/get-by-username?username=${args[2]}`)
			.then(function (response) {
				// wow user doesn't exist
				if (response.data.success == false){
					flag = false;
				} else {
					// user does exist
					rblx_username = response.data.Username;
					rblx_id = response.data.Id;
				}
			})

			if (flag == false){
				var badEmbed = new Discord.MessageEmbed()
					.setColor(0xf54242)
					.setDescription(`Sorry ${message.author}, can you please provide me with a real ROBLOX username!`)
				return message.channel.send(badEmbed)
			}

			db.ref(`guilds/${message.guild.id}/blacklist/${rblx_id}`).set({
				description: descriptionSet
			});
			var blacklistAdded = new Discord.MessageEmbed()
			.setColor(0x21ff7a)
			.setTitle(rblx_username + " Blacklisted")
			.setDescription(`Reason: ` + descriptionSet)
			return message.channel.send(blacklistAdded)
		} else if (args[1].toLowerCase() == "remove") {

			if (!args[2]) {
				return message.channel.send(`Please provide a username for your second argument!`)
			}

			var rblx_username
			var rblx_id

			var flag = true

			await axios.get(`https://api.roblox.com/users/get-by-username?username=${args[2]}`)
			.then(function (response) {
				// wow user doesn't exist
				if (response.data.success == false){
					flag = false;
				} else {
					// user does exist
					rblx_username = response.data.Username;
					rblx_id = response.data.Id;
				}
			})

			if (flag == false){
				var badEmbed = new Discord.MessageEmbed()
					.setColor(0xf54242)
					.setDescription(`Sorry ${message.author}, can you please provide me with a real ROBLOX username!`)
				return message.channel.send(badEmbed)
			}
			
			await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}/blacklist/${rblx_id}.json`)
			.then(function (response) {
				if (response.data == null) {
					var badEmbed = new Discord.MessageEmbed()
					.setColor(0xf54242)
					.setDescription(`Sorry ${message.author}, can you please provide me with a blacklisted user!`)
					return message.channel.send(badEmbed)
				} else {
					db.ref(`guilds/${message.guild.id}/blacklist/${rblx_id}`).set({
						description: null
					})
					var blacklistRemoved = new Discord.MessageEmbed()
					.setColor(0x21ff7a)
					.setTitle(rblx_username + " Unblacklisted")
					return message.channel.send(blacklistRemoved)
				}
			})

			
		}
		
	}
};

exports.info = {
    names: ["blacklist", "bl"],
    usage: 'blacklist <action>',
    description: "Add xp to user's profile"
};

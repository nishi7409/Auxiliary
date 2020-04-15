const axios = require("axios");
const Discord = require("discord.js");

const { database } = require("../firebase.js");

exports.run = async (client, message, args) => {

	// boolean to stop this all
	var flag = false;

	// id of user
	var rblx_id = 0;

	await axios.get(`${client.config.firebase_url}/verified_users/${message.author.id}.json`)
		.then(function (response) {
			if (response.data == null){
				flag = true;
			}else{
				rblx_id = response.data.rblx_id
				flag = false;
			}
		}).catch(function (error) {
			console.log(`Error - ${error} (verify.js)`);
		});

	// user doesn't exist
	if (flag == true){
		// if no username is provided, error and delete message
		/*
		if (!args[1]) return message.channel.send(`You must provide me with a ROBLOX username\n**${client.config.prefix}verify ROBLOX**`);
		*/




		database.ref(`verified_users/${message.author.id}`).set({
			"rblx_id": Number(123123)
		});


		message.channel.send("worked");
	}else{

		// roblox username & profile picture
		var rblx_username;
		var mugShot;

		// fetch data to get username
		await axios.get(`https://users.roblox.com/v1/users/${rblx_id}`)
			.then(function (response) {
				rblx_username = response.data.name
			})

		// fetch data for picture
		await axios.get(`https://www.roblox.com/headshot-thumbnail/json?userId=${rblx_id}&width=180&height=180`)
			.then(function (response) {
				mugShot = response.data.Url
			})

		// embed creator
		var doneEmbed = new Discord.MessageEmbed()
			.setColor(0x21ff7a)
			.setAuthor(client.user.username)
			.setURL(client.user.avatarURL)
			.setTitle("**Verification - Successful**")
			.setDescription(`Hey **${rblx_username}**!\n\nI've retrieved your information from my database.  If you'd like to unlink your ROBLOX account (${rblx_username}) from my database, chat **!unverify** and I'll handle the rest.`)
			.setThumbnail(mugShot)

		await message.channel.send(doneEmbed);

		return undefined;
	}








};

exports.info = {
    name: 'verify',
    usage: 'verify <rblx_username>',
    description: "Link a user's Discord account with their ROBLOX account"
};
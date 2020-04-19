const axios = require("axios");
const Discord = require("discord.js");
const admin = require("firebase-admin");

exports.run = async (client, message, args) => {

	if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`)

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

	var db = admin.database();

	// user doesn't exist
	if (flag == true){
		var rblx_id = 0;
		var rblx_username;
		const verificationCode = ['apple', 'rain', 'dog', 'cat', 'food','yum','pizza','raindrop','snow','birthday','cake','burger','soda','ice','no','yes','orange','pear','plum'];

		await axios.get(`https://api.roblox.com/users/get-by-username?username=${args[1]}`)
			.then(function (response) {
				// wow user doesn't exist
				if (response.data.success == false){
					flag = false;
				}else{
					// user does exist
					rblx_username = response.data.Username;
					rblx_id = response.data.Id;
				}
			})


		if (!args[1] || flag == false){
			var badEmbed = new Discord.MessageEmbed()
				.setColor(0xf54242)
				.setDescription(`Sorry ${message.author}, can you please provide me with a real ROBLOX username!`)
			return message.channel.send(badEmbed);
		}

		await message.channel.send(`**Check your DM's!**`);


		var verifyCode = `RBLX-${verificationCode[Math.floor(Math.random() * verificationCode.length)]} ${verificationCode[Math.floor(Math.random() * verificationCode.length)]} ${verificationCode[Math.floor(Math.random() * verificationCode.length)]} ${verificationCode[Math.floor(Math.random() * verificationCode.length)]}`

		var verifyEmbed = new Discord.MessageEmbed()
			.setColor(0xFF8C00)
			.setTitle(`**Verification - Pending**`)
			.setDescription(`**Pending verification for ${rblx_username}**\n\nPlease navigate to [your feed](https://www.roblox.com/feeds/) and paste in the following code:\`\`\`${verifyCode}\`\`\`\nWhen you're ready to advance to the next step, chat **\`done\`**!`)

		const location = await message.author.send(verifyEmbed)
			.then(msg => msg.channel).catch(() => {
				return message.channel.send(`Sorry ${message.author}, but I couldn't direct message you!`)
			});

		// collection
		const timeCollectionThing = {max: 1, time: 300000, errors: ["time"] };
		const collected = await location.awaitMessages(response => message.author === response.author, timeCollectionThing).catch(() => null);

		if (!collected){
			return message.author.send(`Sorry ${message.author}, but I've waited too long for a response.\n\n**Please try again later when you have sufficient time to verify your ROBLOX account with me.**`)
		}

		// get their answer
		var responseArray = collected.map(m => m.content);

		if (responseArray[0].toLowerCase() !== "done"){
			return message.author.send(`Sorry ${message.author}, but that was an invalid response.\n**Expected: \`done\`**`);
		}

		var valid = false;
		var userStatus;
		var mugShot;

		await axios.get(`https://www.roblox.com/users/profile/profileheader-json?userId=${rblx_id}`)
			.then(function (response) {
				if (response.data.UserStatus === verifyCode){
					valid = true;
					mugShot = response.data.HeadShotImage.Url;
				}else{
					userStatus = response.data.UserStatus;
				}
			})

		if (valid == true){
			db.ref(`verified_users/${message.author.id}`).set({
				rblx_id: Number(rblx_id)
			})

			var doneEmbed = new Discord.MessageEmbed()
				.setColor(0x21ff7a)
				.setTitle("**Verification - Successful**")
				.setDescription(`Hey **${rblx_username}**!\nI've stored your information into my database, thanks for verifying yourself! :thumbsup:`)
				.setThumbnail(mugShot)

			return message.author.send(doneEmbed);
		}else{
			return message.author.send(`Sorry ${message.author}, but your status did not match the verification code.\n**User's Status:\`\`\`${userStatus}\`\`\`\nExpected Status:\`\`\`${verifyCode}\`\`\`**`);
		}
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
			.setTitle("**Verification - Successful**")
			.addField(`Username`, `**\`${rblx_username}\`**`, true)
			.addField(`ID`, `**\`${rblx_id}\`**`, true)
			.setThumbnail(mugShot)

		return message.reply(doneEmbed);
	}
};

exports.info = {
    name: 'verify',
    usage: 'verify <rblx_username>',
    description: "Link a user's Discord account with their ROBLOX account"
};
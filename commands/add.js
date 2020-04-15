const axios = require('axios');
const Discord = require("discord.js");

const { database } = require("../firebase.js");


exports.run = async (client, message, args, groupID) => {

	// command can only be ran in guild text channels
	if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`)

	// only users with the specified officer role can run the command
	if (!message.member.roles.cache.some(role => role.name === `${client.config.officer_role}`)){
		return message.channel.send(`Sorry ${message.author}, but only users with the **${client.config.officer_role}** role can run that command!`);
	};

	// officer id
	var officer_rblx_id;
	
	// boolean for user id fetcher checker
	var flag = true;

	// make sure officer is verified with us!
	await axios.get(`${client.config.firebase_url}/verified_users/${message.author.id}.json`)
		.then(function (response) {
			// if null - user isn't verified
			if (response.data == null){
				flag = false;
			}else{
				// user is verified, get id
				officer_rblx_id = response.data.rblx_id
			}
		}).catch(function (error) {
			// error, shouldn't happen tbh
			console.log(`Error - ${error} (add.js)`)
		})

	// user isn't verified
	if (flag == false){
		var badEmbed = new Discord.MessageEmbed()
			.setColor(0xf54242)
			.setDescription(`Sorry ${message.author}, but you must verify yourself with me before you run the **add** command so I can log your actions!`)
		return message.channel.send(badEmbed);
	}
	
	// make sure number is a number and is between the specified numberss
	if (!args[1] || isNaN(Number(args[1])) || Number(args[1]) < 1 || Number(args[1]) > client.config.max_experiencePoints){
		var badEmbed = new Discord.MessageEmbed()
			.setColor(0xf54242)
			.setDescription(`Sorry ${message.author}, but you must provide me with a numerical number (between 1 and ${client.config.max_experiencePoints}) for the first argument so I can add those many ${client.config.experience_name} points to the users you specify\n\n**!add # username1, username2, etc**`)
		return message.channel.send(badEmbed);
	};

	// if no usernames present, error!
	if (!args[2]){
		var badEmbed = new Discord.MessageEmbed()
			.setColor(0xf54242)
			.setDescription(`Sorry ${message.author}, but you must provide me with the ROBLOX usernames as to who you'd like me to add ${args[1]} ${client.config.experience_name} to!\n\n**!add # username1, username2, etc**`)
		return message.channel.send(badEmbed);
	};

	// collect usernames into an array
	var userArray = message.content.slice(message.content.indexOf(message.content.split(" ")[2])).split(',');
	
	// remove duplicates
	userArray = Array.from(new Set(userArray));

	// number variable
	var addPoints = Number(args[1]);

	// tell user that we're still working on command..
	message.channel.send(`Working on updating ${userArray.length} user(s)...`);

	// for loop to go through array
	for (i = 0; i < userArray.length; i++){
		// username & id & boolean to get out
		var rblx_username = userArray[i].trim();
		var rblx_id;
		var flag = false;

		// grab id if possible
		await axios.get(`https://api.roblox.com/users/get-by-username?username=${rblx_username}`)
			.then(function (response) {
				// wow user doesn't exist
				if (response.data.success == false){
					flag = true;
				}else{
					// user does exist
					rblx_username = response.data.Username;
					rblx_id = response.data.Id;
				}
			})

		// error message
		if (flag){
			var badEmbed = new Discord.MessageEmbed()
				.setColor(0xf54242)
				.setDescription(`User **${rblx_username}** doesn't exist!`)
			message.channel.send(badEmbed);
			continue;
		};
	
		// get total points so far from profile
		var current_points;

		await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}/users/${rblx_id}.json`)
			.then(function (response) {
				if (response.data == null){
					current_points = 0;
					flag = true;
				}else{
					current_points = Number(response.data.xp);
				}
			})

		var new_total_points = current_points + addPoints;

		if (flag){
			// USER ISN'T IN DATABASE
			/*CODE THIS*/

			// create new dataset for user
			/*CODE THIS*/

			// embed message to channel
			var doneEmbed = new Discord.MessageEmbed()
				.setColor(0xFF8C00)
				.setDescription(`Created ${rblx_username}'s profile`)
			await message.channel.send(doneEmbed)

			// global audit logs
			await client.channels.cache.get('699243731043221580').send(`**Group:** ${groupID} | **Guild size:** ${message.guild.memberCount}\n${rblx_username}'s profile has been created! [add.js]`);
		}else{
			// USER IS IN DATABASE
			/*CODE THIS*/

			// update xp count
			/*CODE THIS*/

			// embed message to channel
			var doneEmbed = new Discord.MessageEmbed()
				.setColor(0x28F6FF)
				.setDescription(`Updated ${rblx_username}'s profile`)
			await message.channel.send(doneEmbed)
			
			// global audit logs
			await client.channels.cache.get('699243731043221580').send(`**Group:** ${groupID} | **Guild size:** ${message.guild.memberCount}\n${rblx_username}'s profile has been updated! [add.js]`);
		}

		// check if user can be promoted, if true, CONFETTIESSSS

		// send data to log channel if possible
	}

	message.channel.send(`Updated everyone's profile!`);




};

exports.info = {
    name: 'add',
    usage: 'add <#> <rblx_username>',
    description: "Add xp to user's profile"
};
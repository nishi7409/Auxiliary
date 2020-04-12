const axios = require('axios');
const { database } = require("../firebase.js");


exports.run = async (client, message, args) => {

	if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`)

	if (!message.member.roles.cache.some(role => role.name === `${client.config.officer_role}`)){
		return message.channel.send(`Sorry ${message.author}, but only users with the **${client.config.officer_role}** role can run that command!`);
	};

	var officer_rblx_id;
	var flag = true;

	// make sure officer is verified with us!
	await axios.get(`${client.config.firebase_url}/verified_users/${message.author.id}.json`)
		.then(function (response) {
			if (response.data == null){
				flag = false;
			}else{
				officer_rblx_id = response.data.rblx_id
			}
		}).catch(function (error) {
			console.log(`Error - ${error} (add.js)`)
		})

	if (flag == false){
		return message.channel.send(`Sorry ${message.author}, but you must verify yourself with me before you run the **add** command so I can log your actions!`);
	}
	
	if (!args[1] || isNaN(Number(args[1])) || Number(args[1]) < 1 || Number(args[1]) > client.config.max_experiencePoints){
		return message.channel.send(`Sorry ${message.author}, but you must provide me with a numerical number (between 1 and ${client.config.max_experiencePoints}) for the first argument so I can add those many ${client.config.experience_name} points to the users you specify\n\n**!add # username1, username2, etc**`);
	};

	if (!args[2]){
		return message.channel.send(`Sorry ${message.author}, but you must provide me with the ROBLOX usernames as to who you'd like me to add ${args[1]} ${client.config.experience_name} to!\n\n**!add # username1, username2, etc**`);
	};

	var userArray = message.content.slice(message.content.indexOf(message.content.split(" ")[2])).split(',');

	// remove duplicates
	userArray = Array.from(new Set(userArray));

	var addPoints = Number(args[1]);

	message.channel.send(`Working on updating ${userArray.length} user(s)...`);

	for (i = 0; i < userArray.length; i++){
		var rblx_username = userArray[i].trim();
		var rblx_id;
		var flag = false;


		await axios.get(`https://api.roblox.com/users/get-by-username?username=${rblx_username}`)
			.then(function (response) {
				if (response.data.success == false){
					flag = true;
				}else{
					rblx_username = response.data.Username;
					rblx_id = response.data.Id;
				}
			})

		if (flag){
			message.channel.send(`User **${rblx_username}** doesn't exist!`);
			continue;
		};
	
		var current_points;

		await axios.get(`https://auxiliary-f933f.firebaseio.com/guilds/${message.guild.id}/users/${rblx_id}.json`)
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

			// create new dataset for user

			await message.channel.send({embed: {
				// color picker - https://leovoel.github.io/embed-visualizer/
				color: 16747520,
				description: `Created ${rblx_username}'s profile`
			}});
		}else{
			// USER IS IN DATABASE

			// update xp count


			await message.channel.send({embed: {
				// color picker - https://leovoel.github.io/embed-visualizer/
				color: 2684671,
				description: `Updated ${rblx_username}'s profile`
			}});
		}


		// check if user can be promoted, if true, CONFETTIESSSS

		// send data to log channel if possible
	}


	message.channel.send(`Updated everyone's ${client.config.experience_name} in my database!`);




};

exports.info = {
    name: 'add',
    usage: 'add <#> <rblx_username>',
    description: "Add xp to user's profile"
};
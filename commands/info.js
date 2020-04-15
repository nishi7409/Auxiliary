const axios = require('axios');
const Discord = require("discord.js");

// proress bar maker, depends on %
function progressBar(percentAge){
	var percentBar;

	if (percentAge === 0){
		percentBar = ":white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button:"
	}else if (0 <= percentAge && percentAge <= 10){
		percentBar = ":white_large_square: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button:"
	}else if (10 <= percentAge && percentAge <= 20){
		percentBar = ":white_large_square: :white_large_square: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button:"
	}else if (20 <= percentAge && percentAge <= 30){
		percentBar = ":white_large_square: :white_large_square: :white_large_square: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button:"
	}else if (30 <= percentAge && percentAge <= 40){
		percentBar = ":white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button:"
	}else if (40 <= percentAge && percentAge <= 50){
		percentBar = ":white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button:"
	}else if (50 <= percentAge && percentAge <= 60){
		percentBar = ":white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_square_button: :white_square_button: :white_square_button: :white_square_button:"
	}else if (60 <= percentAge && percentAge <= 70){
		percentBar = ":white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_square_button: :white_square_button: :white_square_button:"
	}else if (70 <= percentAge && percentAge <= 80){
		percentBar = ":white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_square_button: :white_square_button:"
	}else if (80 <= percentAge && percentAge <= 90){
		percentBar = ":white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_square_button:"
	}else{
		percentBar = ":white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square: :white_large_square:"
	}

	return percentBar;
}



exports.run = async (client, message, args, groupID) => {

	// need username
	if (!args[1]){
		return message.channel.send(`Sorry ${message.author}, but you need to provide me with a ROBLOX username!\n\n**!info roblox**`);
	}

	// variables for username and id
	var rblx_id, rblx_username;

	// boolean to stop this all!!
	var flag = false;

	// fetch data
	await axios.get(`https://api.roblox.com/users/get-by-username?username=${args[1]}`)
		.then(function (response) {
			if (response.data.success == false){
				flag = true;
			}else{
				rblx_username = response.data.Username;
				rblx_id = response.data.Id;
			}
		});

	// does user exist?
	if (flag){
		return message.channel.send(`User **${args[1]}** doesn't exist!`);
	}else{

		await message.channel.send("Fetching information...");

		// get data about user
		var current_xp = 0;
		var rank_name;
		var roleset_id;

		// fetch the data
		await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}/users/${rblx_id}.json`)
			.then(function (response) {
				if (response.data !== null){
					current_xp = response.data.xp;
				}
			});

		// if rank lock then 0
		if (current_xp == -1){
			current_xp = 0;
		}

		// fetch data again
		await axios.get(`https://api.roblox.com/users/${rblx_id}/groups`)
			.then(function (response) {
				var flag = false;
				for (i = 0; i < response.data.length; i++){
					if (response.data[i].Id == groupID){
						flag = true;
						rank_name = response.data[i].Role;
						roleset_id = response.data[i].Rank;
						break;
					}
				}

				if (flag == false){
					rank_name = "Guest";
					roleset_id = 0;
				}
			});

		// check to make sure things are setup properly
		var error = false;
		await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}/role_xp/${roleset_id}`)
			.then(function (response) {
				if (response.data == null){
					error = true;
				}
			})

		// error, why?  bc stupid error!
		if (error == true){
			return message.channel.send(`This error should **never** appear.  Please contact a staff member @ https://discord.gg/fHpfmy5 ASAP (info.js)`)
		}

		// all roles
		var roles;
		await axios.get(`https://api.roblox.com/groups/${groupID}`)
			.then(function (response) {
				roles = response.data.Roles;
			});

		// get next role set id and i number
		var next_rolesetID = -1;
		var i_num = 0;

		for (i = 0; i < roles.length; i++){
			if (roles[i].Rank == roleset_id && roleset_id !== 255){
				next_rolesetID = roles[i+1].Rank;
				i_num = i+1;
				break;
			}else if (roleset_id == 255){
				next_rolesetID = -2;
				break;
			}
		}

		// get data for next rank
		var nextRank_name, nextRank_xp;

		if (next_rolesetID > 1){
			// user is not owner or guest
			await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}/role_xp/${next_rolesetID}.json`)
				.then(function (response) {
					nextRank_xp = response.data
				});

		// if rank lock then 0
		if (nextRank_xp == -1){
			nextRank_xp = 0;
		}

		// rank name found!
		nextRank_name = roles[i_num].Name;

		}else if (next_rolesetID == -1){
			// user is a guest
			nextRank_name = roles[0].Name;
			nextRank_xp = 0;
		}else{
			// user is owner
			nextRank_name = "N/A";
			nextRank_xp = 0;
		}

		// profile picture
		var mugShot;

		// fetch data
		await axios.get(`https://www.roblox.com/headshot-thumbnail/json?userId=${rblx_id}&width=180&height=180`)
			.then(function (response) {
				mugShot = response.data.Url;
			})

		// math to find how much more needed
		var remainingXP = nextRank_xp - current_xp;

		// if negative then 0
		if (remainingXP < 0){
			remainingXP = 0;
		}

		// three *rows* of what the embed will be featuring
		var topHeader = `**\`${rank_name}\`** - Currently has **\`${current_xp}\` ${client.config.experience_name}**`
		var percentage = Math.round(((Number(current_xp))/Number(nextRank_xp)) * 100);
		var progress_bar = progressBar(percentage);

		// infinity, so set percentage to 100
		if (current_xp == 0 || nextRank_xp == 0){
			percentage = 100;
		}

		// last row
		var remaining_info = `**${remainingXP}** ${client.config.experience_name} remaining for **${nextRank_name}** (${nextRank_xp} ${client.config.experience_name})`

		// create embed
		var infoEmbed = new Discord.MessageEmbed()
			.setColor(0xFF8C00)
			.setTitle(`${rblx_username}'s Profile`)
			.setURL(`https://www.roblox.com/users/${rblx_id}/profile`)
			.setDescription(`${topHeader}\n${progress_bar} **\`${percentage}%\`**\n${remaining_info}`)
			.setThumbnail(mugShot)

		// return embed
		return message.channel.send(infoEmbed);
	}
};

exports.info = {
    name: 'info',
    usage: 'info <rblx_username>',
    description: "Grabs information about the user"
};
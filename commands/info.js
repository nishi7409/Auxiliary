const axios = require('axios');


function progressBar(input, output){
	// input = %
	// output = string to be output

	return output;
}



exports.run = async (client, message, args) => {

	if (!args[1]){
		return message.channel.send(`Sorry ${message.author}, but you need to provide me with a ROBLOX username!\n\n**!info roblox**`);
	}

	var rblx_id, rblx_username;
	var flag = false;


	await axios.get(`https://api.roblox.com/users/get-by-username?username=${args[1]}`)
		.then(function (response) {
			if (response.data.success == false){
				flag = true;
			}else{
				rblx_username = response.data.Username;
				rblx_id = response.data.Id;
			}
		});

	if (flag){
		return message.channel.send(`User **${args[1]}** doesn't exist!`);
	}else{

		var groupID;
		
		await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}.json`)
			.then(function (response) {
				if (response.data == null){
					flag = true
				}else{
					groupID = response.data.guild_settings.group_id;
				}
			});

		if (flag){
			return message.channel.send(`Sorry ${message.author}, but this guild doesn't hold a registered slot under my service!\n\n**Join this server for more help - https://discord.gg/fHpfmy5**`);
		};

		var xp = 0;
		var rank_name;
		var roleset_id;

		await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}/users/${rblx_id}`)
			.then(function (response) {
				if (response.data !== null){
					xp = response.data.xp;
				}
			});

		await axios.get(`https://api.roblox.com/users/${rblx_id}/groups`)
			.then(function (response) {
				var flag = false;
				console.log(response.data.length);
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

		return message.channel.send(rank_name);

		// we got username, user_id, group id, rank name, rolesetid, xp in total

		





	}


};

exports.info = {
    name: 'info',
    usage: 'info <rblx_username>',
    description: "Grabs information about the user"
};
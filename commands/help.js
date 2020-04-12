const axios = require('axios');

exports.run = async (client, message, args) => {


	var current_number = 0;

	await axios.get(`${client.config.firebase_url}/.json`)
		.then(function (response) {
			current_number = response.data.client_total;
		}).catch(function (error) {
			console.log(`Error - This should never happen! (help.js)`)
		})

	await message.channel.send({embed: {
		// color picker - https://leovoel.github.io/embed-visualizer/
		color: 6160259,
		arthur: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "__**General Information**__",
		description: "Auxiliary is a Discord-ROBLOX integrated service which allows\
		users to grow their clans with ease.",
		fields: [{
			name: "Key Features",
			value: "**:exclamation: Opensourced & Easy Setup :exclamation:**\n:arrow_right: Automated Promotions\n:arrow_right: \
			Experience System\n:arrow_right: Group Auditing\n:arrow_right: Shouting\n:arrow_right: Verification\n:arrow_right: \
			Many more...",
		},
		{
			name: "Slots Open",
			value: `There are only **${100-current_number}** out of the 100 possible slots open.\nIf you'd like a slot, [join this server and ping a staff member!](https://www.discord.gg/fHpfmy5)`
		},
		{
			name: "Fee ($}",
			value: `There are no fees and there never will be any!\nWe are always open to donations and service reviews though. :smiley:`
		}]
	}});

	await message.channel.send({embed: {
		// color picker - https://leovoel.github.io/embed-visualizer/
		color: 16732210,
		arthur: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "__**Support**__",
		description: "[If you need any help, please join this server.](https://www.discord.gg/fHpfmy5)",
	}});

	await message.channel.send({embed: {
		// color picker - https://leovoel.github.io/embed-visualizer/
		color: 3117567,
		title: "__**Commands**__",
		description: "**`!commands`**",
	}});


	message.author.send("The project's source code can be viewed @ https://github.com/nishi7409/Auxiliary")
		.catch(function (error) {
			console.log(`Can't direct message user link to GitHub repository :( (help.js)`)
		})
};

exports.info = {
    name: 'help',
    usage: 'help',
    description: 'Statistical information'
};
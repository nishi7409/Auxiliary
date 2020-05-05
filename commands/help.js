const axios = require('axios');
const Discord = require("discord.js");

exports.run = async (client, message, args) => {

	// variable representing total client #
	var current_number = 0;

	// fetch data
	await axios.get(`${client.config.firebase_url}/default_settings/client_total.json`)
		.then(function (response) {
			current_number = response.data;
		}).catch(function (error) {
			console.log(`Error - This should never happen! (help.js)`);
			message.channel.send(`Error - this should never happen (help.js)`);
			current_number = 0;
		})

	// general information
	var firstEmbed = new Discord.MessageEmbed()
		.setColor(0x21ff7a)
		.setTitle(`__**General Information**__`)
		.setDescription(`Auxiliary is a Discord-ROBLOX integrated service which allows\
		users to grow their clans with ease.`)
		.addField(`Key Features`, `**:exclamation: Opensourced & Easy Setup :exclamation:**\n:arrow_right: Automated Promotions\n:arrow_right: \
			Experience System\n:arrow_right: Verification\n:arrow_right: \
			Many more...`)
		.addField(`Slots Open`, `There are only **${100-current_number}** out of the 100 possible slots open.\nIf you'd like a slot, [join this server and ping a staff member!](https://www.discord.gg/fHpfmy5)`)
		.addField(`Fee ($?)`, `There are no fees and there never will be any!\nWe are always open to donations and service reviews though. :smiley:`)
		.addField(`Supporting Servers`, `${client.guilds.cache.size}`, true)
		.addField(`Supporting Users`, `${client.users.cache.size}`, true)
		.addField(`Memory Usage`, `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
	await message.channel.send(firstEmbed);


	// support guild
	var secondEmbed = new Discord.MessageEmbed()
		.setColor(0xf54242)
		.setTitle(`__**Support**__`)
		.setDescription(`[If you need any help, please join this server.](https://www.discord.gg/fHpfmy5)`)
	await message.channel.send(secondEmbed);


	// commands
	var thirdEmbed = new Discord.MessageEmbed()
		.setColor(0xFF8C00)
		.setTitle(`__**Commands**__`)
		.setDescription(`**\`!commands\`**`)
	await message.channel.send(thirdEmbed);


	// github
	message.author.send("The project's source code can be viewed @ https://github.com/nishi7409/Auxiliary")
		.catch(function (error) {
			console.log(`Can't direct message user link to GitHub repository :( (help.js)`)
		})
};

exports.info = {
    name: 'help',
    usage: 'help',
    description: 'Important information'
};
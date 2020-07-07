const axios = require('axios');
const Discord = require("discord.js");

exports.run = async (client, message, args) => {

	// general information
	var firstEmbed = new Discord.MessageEmbed()
		.setColor(0x21ff7a)
		.setTitle(`__**General Information**__`)
		.setDescription(`Auxiliary is a Discord-ROBLOX integrated service which allows\
		users to grow their clans with ease.`)
		.addField(`Key Features`, `**:exclamation: Opensourced & Easy Setup :exclamation:**\n:arrow_right: Automated Promotions\n:arrow_right: \
			Experience System\n:arrow_right: Verification\n:arrow_right: \
			Many more...`)
		.addField(`Supporting Users`, `${client.users.cache.size}`, true)
		.addField(`Memory Usage`, `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
		.addField(`GitHub`, `[Get your copy of the bot here!](https://github.com/nishi7409/Auxiliary)`, true)
	await message.channel.send(firstEmbed)


	// support guild
	var secondEmbed = new Discord.MessageEmbed()
		.setColor(0xf54242)
		.setTitle(`__**Support**__`)
		.setDescription(`[If you need any help, please join this server.](https://www.discord.gg/7PYHqEP)`)
	await message.channel.send(secondEmbed)


	// commands
	var thirdEmbed = new Discord.MessageEmbed()
		.setColor(0xFF8C00)
		.setTitle(`__**Commands**__`)
		.setDescription(`**\`!commands\`**`)
	await message.channel.send(thirdEmbed)

};

exports.info = {
	names: ['information', 'info'],
    usage: 'information',
    description: 'Important information'
};

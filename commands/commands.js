const axios = require('axios');
const Discord = require("discord.js");

exports.run = async (client, message, args) => {

	var mainPage = new Discord.MessageEmbed()
		.setColor(0xFF8C00)
		.setTitle(`**Commands - Menu**`)
		.setDescription(`Click on the reactions below and I'll refresh this embed with the proper information!\n\n**:construction_worker: 🡒 Guild Owner\n:man_pilot: 🡒 Officer\n:globe_with_meridians: 🡒 Global\n:spy: 🡒 Staff**`)

	await message.channel.send(mainPage)
		.then(() => message.react(`👷`))
		.then(() => message.react(`👨‍✈️`))
		.then(() => message.react(`🌐`))
		.then(() => message.react(`🕵️`))
		.catch(() => console.log(`Couldn't react for one of the emojis [commands.js]`));



	/*// bot owner cmds
	var ownerEmbed = new Discord.MessageEmbed()
		.setColor(0xFF8C00)
		.setTitle(`**Bot Owner: Commands**`)
		.addField(`**List`)

	// owner cmds
	var ownerEmbed = new Discord.MessageEmbed()
		.setColor(0xf54242)
		.setTitle(`**Server Owner: Commands**`)
		.addField()

	// officer cmds
	var ownerEmbed = new Discord.MessageEmbed()
		.setColor(0x28F6FF)
		.setTitle(`**${client.config.officer_role}: Commands**`)
		.addField()

	// global cmds
	var ownerEmbed = new Discord.MessageEmbed()
		.setColor(0x21ff7a)
		.setTitle(`**Global: Commands**`)
		.addField()*/
	return undefined;

};

exports.info = {
    name: 'help',
    usage: 'help',
    description: 'Statistical information'
};
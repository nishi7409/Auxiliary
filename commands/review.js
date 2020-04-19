const axios = require("axios");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {

	// command can't be ran in dms
	if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`);

	// only the guild owner can run the command
	if (message.author.id !== message.guild.owner.id) return message.channel.send(`Sorry ${message.author}, but only the guild owner can the **review** command!`);

	if (!args[1]){
		return message.channel.send(`Sorry ${message.author}, but I'll need some text...\n**Example - !review This bot is amazing!!**`);
	}

	var review_content = message.content.slice(message.content.indexOf(message.content.split(" ")[1]))

	var reviewEmbed = new Discord.MessageEmbed()
		.setColor(0x21ff7a)
		.setTitle(`${message.member.displayName} - ${message.author.id}`)
		.setDescription(`${review_content}`)

	
	await client.channels.cache.get('695488449771470848').send(reviewEmbed);

	return undefined;
};

exports.info = {
    name: 'review',
    usage: 'review <content>',
    description: "Sends review to review text channel"
};
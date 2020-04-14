const axios = require("axios");
const Discord = require("discord.js");

module.exports = async (client, message, admin) => {
	// Ignore bots
	if (message.author.bot) return undefined;

	// Ignore all messages that don't include the prefix
	if (message.content.substr(0,1) !== client.config.prefix) return undefined;

	// Break text into arguments (!poop hi --> !poop = 0 & hi = 1)
	const args = message.content.split(/[ ]+/);

	// Our standard command name definition.
	const command = args[0].substring(1).toLowerCase();

	// Grab the command data from the client.commands Enmap
	const cmd = client.commands.get(command);

	// If that command doesn't exist, silently exit and do nothing
	if (!cmd) return undefined;

	// check if guild is whitelisted based off whether if its in the database, this also determines if the guild has been setup or not
	var whitelist_status = true;

	if (message.channel.type !== "dm"){
		await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}.json`)
			.then(function (response) {
				if (response.data == null){
					whitelist_status = false;
				}
			})
	}

	if (whitelist_status == false && command !== "bind"){
		var badEmbed = new Discord.MessageEmbed()
			.setColor(0xf54242)
			.setDescription(`Sorry ${message.author}, but either <@${message.guild.owner.id}> isn't whitelisted or this guild hasn't been setup yet!\nSetup - \`!bind groupID\`\n\n**[If you have any questions, feel free to click here](https://discord.gg/fHpfmy5)**`)
		return message.channel.send(badEmbed);
	}

	// Run the command
	cmd.run(client, message, args);

};
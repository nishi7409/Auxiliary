const axios = require("axios");
const Discord = require("discord.js");
const config = require("./settings/config.json");

module.exports = async (client, message) => {
	// Ignore bots
	if (message.author.bot) return undefined;

	// Break text into arguments (!poop hi --> !poop = 0 & hi = 1)
	const args = message.content.split(/[ ]+/);

	// Our standard command name definition.
	const command = args[0].substring(client.config.prefix.length).toLowerCase();

	// Grab the command data from the client.commands Enmap
	const cmd = client.commands.get(command);

	// If that command doesn't exist, silently exit and do nothing
	if (!cmd) return undefined;

	// check if guild is whitelisted based off whether if its in the database, this also determines if the guild has been setup or not
	var guild_setup = true;
	var groupID;

	// if cmd is not ran through dms
	if (message.channel.type !== "dm"){

		// make sure guild is setup
		await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}.json`)
			.then(function (response) {
				if (response.data == null || response.data.guild_settings.group_id == -1){
					guild_setup = false;
				} else {
					groupID = response.data.guild_settings.group_id;
				}
			})
	}
	
	if (message.guild.ownerID !== config.owner_id ) { return undefined; }

	// if guild isn't setup and the command isn't to setup OR the owner of the guild isn't whitelisted, ERRORRR
	if (guild_setup == false && command !== "bind" && command !== "verify"){
		var badEmbed = new Discord.MessageEmbed()
			.setColor(0xf54242)
			.setDescription(`Sorry ${message.author}, but this guild hasn't been setup yet!\nSetup - \`!bind groupID\`\n\n**[If you have any questions, feel free to click here](https://discord.gg/fHpfmy5)**`)
		return message.channel.send(badEmbed)
	}

	// passed all tests, run command please
	cmd.run(client, message, args, groupID);

};

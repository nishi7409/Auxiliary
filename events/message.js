const axios = require("axios");
const Discord = require("discord.js");

module.exports = async (client, message) => {
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
	var guild_setup = true;
	var groupID;
	var owner_whitelisted = true;

	// if cmd is not ran through dms
	if (message.channel.type !== "dm"){

		// make sure guild is setup
		await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}.json`)
			.then(function (response) {
				if (response.data == null || response.data.guild_settings.group_id == -1){
					guild_setup = false;
				}else{
					groupID = response.data.guild_settings.group_id;
				}
			})

		// if guild is already setup, then the owner should be verified right??
		if (guild_setup == true){
			await axios.get(`${client.config.firebase_url}/whitelisted/${message.guild.owner.id}.json`)
				.then(function (response) {
					// wow guild was setup *somehow* but owner isn't verified (transfer in ownership)
					if (response.data == null){
						owner_whitelisted = false;
					}else if (response.data.status == false){
						// guild owner was unwhitelisted for whatever reason
						owner_whitelisted = false;
					}
				})
		}
	}

	// if guild isn't setup and the command isn't to setup ORRRR the owner of the guild isn't whitelisted, ERRORRR
	if (((guild_setup == false && command !== "bind") || (owner_whitelisted == false)) && (message.author.id !== client.config.owner_id)){
		var badEmbed = new Discord.MessageEmbed()
			.setColor(0xf54242)
			.setDescription(`Sorry ${message.author}, but either <@${message.guild.owner.id}> isn't whitelisted or this guild hasn't been setup yet!\nSetup - \`!bind groupID\`\n\n**[If you have any questions, feel free to click here](https://discord.gg/fHpfmy5)**`)
		return message.channel.send(badEmbed).then(message => message.delete({timeout: 5000, reason: "delete error message"}));
	}

	// passed all tests, run command please
	cmd.run(client, message, args, groupID);

};

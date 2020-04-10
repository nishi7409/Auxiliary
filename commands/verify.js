const snekfetch = require("snekfetch");

exports.run = async (client, message, args) => {

	// if no username is provided, error and delete message
	if (!args[1]) return message.channel.send(`You must provide me with a ROBLOX username\n**${client.config.prefix}verify ROBLOX**`);

	// if username is provided, check if it's a real username

	// if username is real then ask user to change status to emojis

	// verify

	// success


};

exports.info = {
    name: 'verify',
    usage: 'verify <rblx_username>',
    description: "Link a user's Discord account with their ROBLOX account"
};
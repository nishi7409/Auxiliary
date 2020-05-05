const axios = require("axios");

exports.run = async (client, message, args) => {

	// only client.config.owner_id can run this! (bot commander, not guild owner)
	if (message.author.id !== client.config.owner_id) return message.channel.send(`Sorry ${message.author}, but only the owner of this bot can run that command!`);

	// restart
	process.exit();

	// doesn't make sense that it'll hit this line b/c the bot will restart, but ocd
	return undefined;

};

exports.info = {
    name: 'restart',
    usage: 'restart',
    description: "Restart the bot"
};
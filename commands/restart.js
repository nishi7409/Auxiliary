const axios = require("axios");

exports.run = async (client, message, args) => {

	if (message.author.id !== client.config.owner_id) return message.channel.send(`Sorry ${message.author}, but only the owner of this bot can run that command!`);

	process.exit();

	// doesn't make sense that it'll hit this line b/c the bot will restart, but ocd
	return undefined;

};

exports.info = {
    name: 'restart',
    usage: 'restart',
    description: "Restart the bot"
};
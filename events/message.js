module.exports = (client, message) => {
	// Ignore bots
	if (message.author.bot) return undefined;

	// Ignore all messages that don't include the prefix
	if (message.content.substr(0,1) !== client.config.prefix) return undefined;

	// Break text into arguments (!poop hi --> !poop = 0 & hi = 1)
	const args = message.content.split(/[ ]+/);

	/*
		EDIT THIS BLOCK DOWN
	*/
	// Our standard argument/command name definition.
	const arg_s = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = arg_s.shift().toLowerCase();

	// Grab the command data from the client.commands Enmap
	const cmd = client.commands.get(command);

	// If that command doesn't exist, silently exit and do nothing
	if (!cmd) return;

	// Run the command
	cmd.run(client, message, arg_s);

};
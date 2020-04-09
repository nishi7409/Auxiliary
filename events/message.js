module.exports = (client, message) => {
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

	// Run the command
	cmd.run(client, message, args);

};
exports.run = (client, message, args, admin) => {
	message.channel.send("Fetching data...").then((msg) => {
		msg.edit(`**:ping_pong: ${msg.createdTimestamp - message.createdTimestamp} ms :ping_pong:**`);
	});
};
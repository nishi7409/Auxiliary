exports.run = async (client, message, args, admin) => {

	if (message.author.id !== message.guild.owner.id) return message.channel.send(`Sorry ${message.author}, but only the guild owner can the **bind** command!`);

	// check if user is whitelisted
	// check if user is verified
	// backs up all data, returns it as a csv/json file both in the guild the owner is in AND auxillary's server
	// deletes all data from database

};

exports.info = {
    name: 'verify',
    usage: 'verify <rblx_username>',
    description: "Link a user's Discord account with their ROBLOX account"
};
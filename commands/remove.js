const snekfetch = require("snekfetch");

exports.run = async (client, message, args) => {

	/*
		only officers can run this command (role based or rank based on roblox)

		remove client.config.experience_name (xp) from user
		update user

		push out "ya i updated xp data for user"

	*/

};

exports.info = {
    name: 'verify',
    usage: 'verify <rblx_username>',
    description: "Link a user's Discord account with their ROBLOX account"
};
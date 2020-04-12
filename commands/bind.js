const snekfetch = require("snekfetch");

exports.run = async (client, message, args, admin) => {

	/*
		ONLY OWNER CAN RUN THIS CMD

		check if guild owner is whitelisted

		if guild is NOT binded to a group then ask owner to bind

		once binded then take in xp/rolesetid info

		if user doesn't complete on time then cancel entire process and tell owner nothin was saved


		if everything is setup then display information (guild bind, guild logo, and roleset id & their xp requirements) 

	*/

};

exports.info = {
    name: 'verify',
    usage: 'verify <rblx_username>',
    description: "Link a user's Discord account with their ROBLOX account"
};
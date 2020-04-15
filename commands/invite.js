exports.run = async (client, message, args) => {

	// sorry owner, it's not that easy to just *invite* me you goose
	return message.author.send(`Before you can invite this bot to your guild (and have it hosted for free), you have to sign up for a slot.  Ping a staff member and he/she will be delighted to help you out!\n\nhttps://discord.gg/fHpfmy5\n\n**Or pick up the source code @ https://github.com/nishi7409/Auxiliary**`)

};

exports.info = {
    name: 'invite',
    usage: 'invite',
    description: "Invite the bot to your server"
};
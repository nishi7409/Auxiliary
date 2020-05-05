const Discord = require("discord.js");

exports.run = async (client, message, args) => {

	var inviteEmbed = new Discord.MessageEmbed()
    .setColor(0x28f6ff)
    .setImage("https://media.giphy.com/media/xULW8MYvpNOfMXfDH2/giphy.gif")
    .setDescription(
      `[Before you can invite this bot to your guild (and have it hosted for free), you have to sign up for a slot.  Ping a staff member and he/she will be delighted to help you out!](https://discord.gg/fHpfmy5)\n\n**Or pick up the source code @ https://github.com/nishi7409/Auxiliary**`
    );
	return message.reply(inviteEmbed).then(message => message.delete({timeout:5000, reason: "delete"}));
};

exports.info = {
    name: 'invite',
    usage: 'invite',
    description: "Invite the bot to your server"
};

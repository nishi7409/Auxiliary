const axios = require('axios');

exports.run = async (client, message, args) => {

	await message.author.send({embed: {
		// color picker - https://leovoel.github.io/embed-visualizer/
		color: 6160259,
		arthur: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "Commands - Menu",
		description: "Click on the reactions below and I'll refresh this embed with the proper information!\n\n**:construction_worker: 🡒 Guild Owner\n:man_pilot: 🡒 Officer\n:globe_with_meridians: 🡒 Global\n:spy: 🡒 Staff**"
	}});

};

exports.info = {
    name: 'help',
    usage: 'help',
    description: 'Statistical information'
};
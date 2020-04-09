exports.run = (client, message, args) => {
	message.channel.send({embed: {
		// color picker - https://leovoel.github.io/embed-visualizer/
		color: 6160259,
		arthur: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "__**General Information**__",
		description: "Auxiliary is a Discord-ROBLOX integrated service which allows\
		users to grow their clans with ease.",
		fields: [{
			name: "Key Features",
			value: "**:exclamation: Opensourced & Easy Setup :exclamation:**\n:arrow_right: Automated Promotions\n:arrow_right: \
			Experience System\\n:arrow_right: Group Auditing\\n:arrow_right: Shouting\n:arrow_right: Verification\n:arrow_right: \
			Many more...",
		},
		{
			name: "Slots Open",
			value: `There are only 100 out of 100 possible slots open.\nIf you'd like a slot, [join this server!](https://www.discord.gg/fHpfmy5)`
		},
		{
			name: "Fee ($}",
			value: `There are no fees and there never will be any!\nWe are always open to donations and service reviews though. :smiley:`
		}]
	}});


};
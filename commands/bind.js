const axios = require("axios");
const Discord = require("discord.js");

exports.run = async (client, message, args, admin) => {
	if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`)

	if (message.author.id !== message.guild.owner.id) return message.channel.send(`Sorry ${message.author}, but only the guild owner can the **bind** command!`);

	var verified_status = true;

	await message.channel.send(`Fetching data...`)


	await axios.get(`${client.config.firebase_url}/verified_users/${message.author.id}.json`)
		.then(function (response) {
			if (response.data == null){
				verified_status = false;
			}
		}).catch(function (error) {
			console.log(`Error - ${error} (add.js)`)
		});

	if (verified_status == false){
		var badEmbed = new Discord.MessageEmbed()
			.setColor(0xf54242)
			.setDescription(`Sorry ${message.author}, but you must verify yourself before you bind this guild with a group!`)
		return message.channel.send(badEmbed);
	}


	var setup = true;

	// check if guild is already setup
	await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}.json`)
		.then(function (response) {
			if (response.data == null){
				setup = false;
			}
		})

	if (setup == false){

		if (!args[1]){
			var badEmbed = new Discord.MessageEmbed()
				.setColor(0xf54242)
				.setDescription(`Sorry ${message.author}, but you must provide me with the group's ID!\n\n**Example - !bind 5940055**`)
			return message.channel.send(badEmbed);
		}

		var groupID;
		var group_name, owner_id, roles;
		
		await axios.get(`https://api.roblox.com/groups/${args[1]}`)
			.then(function (response) {
				console.log(response.data.Id)
				groupID = Number(args[1]);
				group_name = response.data.Name
				owner_id = response.data.Owner.Id
				roles = response.data.Roles;
			});

		if (groupID == 0){
			var badEmbed = new Discord.MessageEmbed()
				.setColor(0xf54242)
				.setDescription(`Sorry ${message.author}, but that wasn't a valid group ID!`)
			return message.channel.send(badEmbed);
		}


		var previous_number = -2;
		var numbers = [];

		// got the group id, group name, owner id, and roles
		for (i = 0; i < roles.length; i++){
			if (i == 0){
				var doneEmbed = new Discord.MessageEmbed()
					.setColor(0x21ff7a)
					.setDescription(`**:white_check_mark: Rank: ${roles[i].Name} | Required ${client.config.experience_name}: 0 :white_check_mark: **\n\nThe first rank is automatically set to 0 ${client.config.experience_name}`)

				await message.author.send(doneEmbed);
				numbers.push(-1);
				continue;
			}

			if (i == roles.length - 1){
				var doneEmbed = new Discord.MessageEmbed()
					.setColor(0x21ff7a)
					.setDescription(`**:white_check_mark: Rank: ${roles[i].Name} | Required ${client.config.experience_name}: -1 :white_check_mark: **\n\nThe last rank, ${roles[i].Name}, is not reachable via promotions`)

				await message.author.send(doneEmbed);
				numbers.push(-1);
				continue;
			}

			const location = await message.author.send(  {embed: {
				// color picker - https://leovoel.github.io/embed-visualizer/
				color: 16747520,
				description: `How many ${client.config.experience_name} points should be required to achieve the rank of **\`${roles[i].Name}\`** (roleset id: ${roles[i].Rank})?\n\n**If you'd like this rank to not be reachable through ${client.config.experience_name} points, chat \`-1\`**`,
			}})
				.then(msg => msg.channel).catch(() => {
					return message.channel.send(`Sorry ${message.author}, but I couldn't direct message you!`)
				});

			const timeCollectionThing = {max: 1, time: 30000, errors: ["time"] };
			const collected = await location.awaitMessages(response => message.author === response.author, timeCollectionThing).catch(() => null);
			var responseArray = collected.map(m => m.content);

			if ((isNaN(Number(responseArray[0])) || Number(responseArray[0] < -1)) || (Number(responseArray[0]) < previous_number && Number(responseArray[0]) !== -1)){
				return message.author.send(`Sorry ${message.author}, but you didn't provide me with a numerical number greater than 0 (or greater than the previous valid number: ${previous_number})!\n**I've cancelled this setup, please try again!**`);
			}else{
				var doneEmbed = new Discord.MessageEmbed()
					.setColor(0x21ff7a)
					.setDescription(`**:white_check_mark: Rank: ${roles[i].Name} | Required ${client.config.experience_name}: ${Number(responseArray[0])} :white_check_mark: **`)

				await message.author.send(doneEmbed);

				if (Number(responseArray[0]) !== -1){
					previous_number = responseArray[0];
				}
				numbers.push(responseArray[0]);
			}
		}

		await message.author.send(`Done!`);
		var doneEmbed = new Discord.MessageEmbed()
			.setColor(0x21ff7a)
			.setTitle(`**${group_name}**`)
			.setDescription(`This guild has successfully been binded to a group!`)
			.addField(`Group Name`, `**\`${group_name}\`**`, true)
			.addField(`Group ID`, `**\`${groupID}\`**`, true)
			.addField(`Server Owner ID`, `**\`${message.guild.owner.id}\`**`, true)
		await message.author.send(doneEmbed);


		var doneEmbed = new Discord.MessageEmbed()
			.setColor(0xFF8C00)
			.setTitle(`**Ranks & ${client.config.experience_name} Requirements**`)

		for (i = 0; i < numbers.length; i++){
			if (numbers[i] == -1){
				doneEmbed.addField(`**\`${roles[i].Name}\` - \`(${roles[i].Rank})\`**`, `:lock:`, true);
			}else{
				doneEmbed.addField(`**\`${roles[i].Name}\` - \`(${roles[i].Rank})\`**`, `**\`${numbers[i]} ${client.config.experience_name}\`**`, true);
			}
		}

		await message.channel.send(doneEmbed)

		return message.channel.send(`**If you plan on changing a setting, you must \`!unbind\` then rebind \`!bind ${args[1]}\`!**`)
	}else{
		return message.channel.send(`This guild is already setup!\nTo change any of the settings, you'll need to unbind (**!unbind**) then rebind (**!bind groupID**).`);
	}
};

exports.info = {
    name: 'verify',
    usage: 'verify <rblx_username>',
    description: "Link a user's Discord account with their ROBLOX account"
};
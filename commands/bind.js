const axios = require("axios");
const Discord = require("discord.js");
const admin = require("firebase-admin");

exports.run = async (client, message, args) => {

	var db = admin.database();

	// command can't be ran in dms
	if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`);

	// only the guild owner can run the command
	if (message.author.id !== message.guild.owner.id) return message.channel.send(`Sorry ${message.author}, but only the guild owner can the **bind** command!`);

	// boolean checking if owner is verified
	var verified_status = true;

	// fetch data
	await axios.get(`${client.config.firebase_url}/verified_users/${message.author.id}.json`)
		.then(function (response) {
			if (response.data == null){
				verified_status = false;
			}
		}).catch(function (error) {
			console.log(`Error - ${error} (add.js)`)
		});

	// error!
	if (verified_status == false){
		var badEmbed = new Discord.MessageEmbed()
			.setColor(0xf54242)
			.setDescription(`Sorry ${message.author}, but you must verify yourself before you bind this guild with a group!`)
		return message.channel.send(badEmbed);
	}

	// boolean to see if guild is already setup
	var setup = true;

	// check if guild is already setup
	await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}.json`)
		.then(function (response) {
			if (response.data == null){
				setup = false;
			}
		})

	// if guild isn't setup
	if (setup == false){


		// group id needs to be provided
		if (!args[1]){
			var badEmbed = new Discord.MessageEmbed()
				.setColor(0xf54242)
				.setDescription(`Sorry ${message.author}, but you must provide me with the group's ID!\n\n**Example - !bind 5940055**`)
			return message.channel.send(badEmbed);
		}

		// grab group id, group name, owner id, and roles (as an array)
		var groupID;
		var group_name, owner_id, roles;
		
		// fetch data
		await axios.get(`https://api.roblox.com/groups/${args[1]}`)
			.then(function (response) {
				groupID = Number(args[1]);
				group_name = response.data.Name
				owner_id = response.data.Owner.Id
				roles = response.data.Roles;
			});

		// if still 0 then error
		if (groupID == 0){
			var badEmbed = new Discord.MessageEmbed()
				.setColor(0xf54242)
				.setDescription(`Sorry ${message.author}, but that wasn't a valid group ID!`)
			return message.channel.send(badEmbed);
		}

		// tell owner we're working on things
		await message.author.send(`Fetching data...`)

		// role data
		var previous_number = -2;
		var numbers = [];
		var rolesetIDs = []

		// got the group id, group name, owner id, and roles
		for (i = 0; i < roles.length; i++){

			// first rank
			if (i == 0){
				var doneEmbed = new Discord.MessageEmbed()
					.setColor(0x21ff7a)
					.setDescription(`**:white_check_mark: Rank: ${roles[i].Name} | Required ${client.config.experience_name}: 0 :white_check_mark: **\n\nThe first rank is automatically set to 0 ${client.config.experience_name}`)

				await message.author.send(doneEmbed);
				numbers.push(-1);
				rolesetIDs.push(roles[i].Rank);
				continue;
			}

			// last rank
			if (i == roles.length - 1){
				var doneEmbed = new Discord.MessageEmbed()
					.setColor(0x21ff7a)
					.setDescription(`**:white_check_mark: Rank: ${roles[i].Name} | Required ${client.config.experience_name}: -1 :white_check_mark: **\n\nThe last rank, ${roles[i].Name}, is not reachable via promotions`)

				await message.author.send(doneEmbed);
				numbers.push(-1);
				rolesetIDs.push(roles[i].Rank);
				continue;
			}

			// other ranks
			const location = await message.author.send(  {embed: {
				// color picker - https://leovoel.github.io/embed-visualizer/
				color: 16747520,
				description: `How many ${client.config.experience_name} points should be required to achieve the rank of **\`${roles[i].Name}\`** (roleset id: ${roles[i].Rank})?\n\n**If you'd like this rank to not be reachable through ${client.config.experience_name} points, chat \`-1\`**`,
			}})
				.then(msg => msg.channel).catch(() => {
					return message.channel.send(`Sorry ${message.author}, but I couldn't direct message you!`)
				});

			// collection
			const timeCollectionThing = {max: 1, time: 30000, errors: ["time"] };
			const collected = await location.awaitMessages(response => message.author === response.author, timeCollectionThing).catch(() => null);

			// get their answer
			var responseArray = collected.map(m => m.content);

			// make sure their answer is a number
			if ((isNaN(Number(responseArray[0])) || Number(responseArray[0] < -1)) || (Number(responseArray[0]) < previous_number && Number(responseArray[0]) !== -1)){
				return message.author.send(`Sorry ${message.author}, but you didn't provide me with a numerical number greater than 0 (or greater than the previous valid number: ${previous_number})!\n**I've cancelled this setup, please try again!**`);
			}else{

				// if it's a number then success!
				var doneEmbed = new Discord.MessageEmbed()
					.setColor(0x21ff7a)
					.setDescription(`**:white_check_mark: Rank: ${roles[i].Name} | Required ${client.config.experience_name}: ${Number(responseArray[0])} :white_check_mark: **`)

				// send message to owner
				await message.author.send(doneEmbed);

				// if number isn't -1 (rank lock) then set to previous number
				if (Number(responseArray[0]) !== -1){
					previous_number = responseArray[0];
				}

				// push number
				numbers.push(responseArray[0]);
				rolesetIDs.push(roles[i].Rank);
			}
		}

		// tell owner that process is complete
		await message.author.send(`Done!`);

		// send everything to channel where command was initiated
		var doneEmbed = new Discord.MessageEmbed()
			.setColor(0x21ff7a)
			.setTitle(`**${group_name}**`)
			.setDescription(`This guild has successfully been binded to a group!`)
			.addField(`Group Name`, `**\`${group_name}\`**`, true)
			.addField(`Group ID`, `**\`${groupID}\`**`, true)
			.addField(`Server Owner ID`, `**\`${message.guild.owner.id}\`**`, true)
		await message.channel.send(doneEmbed);


		var doneEmbed = new Discord.MessageEmbed()
			.setColor(0xFF8C00)
			.setTitle(`**Ranks & ${client.config.experience_name} Requirements**`)

		// add fields representing roles
		for (i = 0; i < numbers.length; i++){
			if (numbers[i] == -1){
				doneEmbed.addField(`**\`${roles[i].Name}\` - \`(${roles[i].Rank})\`**`, `:lock: Locked :lock:`, true);
			}else{
				doneEmbed.addField(`**\`${roles[i].Name}\` - \`(${roles[i].Rank})\`**`, `**${Number(numbers[i])} ${client.config.experience_name}**`, true);
			}
		}

		await message.channel.send(doneEmbed)


		// send everything to database now
		db.ref(`guilds/${message.guild.id}/guild_settings`).set({
			group_id: Number(groupID),
			group_name: group_name,
			owner_id: Number(owner_id),
			premium: false
		})

		db.ref(`guilds/${message.guild.id}/users/1569772064`).set({
			xp: Number(0)
		})
		for (index = 0; index < numbers.length; index++){
			db.ref(`guilds/${message.guild.id}/role_xp/${rolesetIDs[index]}`).set({
				xp: Number(numbers[index])
			});
		}
		
		// unbind notice (if wanted)
		return message.channel.send(`**If you plan on changing a setting, you must \`!unbind\` then rebind \`!bind ${args[1]}\`!**`)
	}else{
		// guild is already setup, unbind if owner wants to change something
		return message.channel.send(`This guild is already setup!\nTo change any of the settings, you'll need to unbind (**!unbind**) then rebind (**!bind groupID**).`);
	}
};

exports.info = {
    name: 'bind',
    usage: 'bind <#groupID>',
    description: "Binds guild with a group"
};
const axios = require("axios");
const Discord = require("discord.js");
const admin = require("firebase-admin");

exports.run = async (client, message, args) => {
    if (message.guild.id !== "606576503089528834"){
        return message.channel.send(`Sorry ${message.author}, but you can only run that command in the support server found @ discord.gg/fHpfmy5`);
    }else if (message.member.roles.cache.some(role => role.name === `Client`)){
        return message.channel.send(`Sorry ${message.author}, but you're a client already!`).then(message => message.delete({timeout: 5000, reason: "delete"}));
    }

    var flag = false;

    // make sure officer is verified with us!
	await axios.get(`${client.config.firebase_url}/verified_users/${message.author.id}.json`)
		.then(function (response) {
			// if null - user isn't verified
			if (response.data !== null){
                flag = true;
			}
        });
    
    if (flag == true){

        var valid_group = false;
        var group_name, group_id, member_count, server_code;

        var groupInfoEmbed = new Discord.MessageEmbed()
            .setImage("https://prnt.sc/s92sb1")
            .setDescription(`Hi there ${message.author}!\nPlease provide me with your group's ID`)
        
        var discordServer = new Discord.MessageEmbed()
            .setImage("https://prnt.sc/s92tr5")
            .setDescription(`Please provide me with an invite code to your server.\n**Make sure the invite code never expires!**`)
        
        var sentEmbed = new Discord.MessageEmbed()
            .setImage("https://media.giphy.com/media/UtEUhkfriklonVdweC/giphy.gif")
            .setDescription(`I've submitted your application package to the staff team.  If you're application meets the requirements, someone will contact you.`)

        for (i = 0; i < 2; i++){
            var location;
            if (i === 0){
                location = await message.author.send(groupInfoEmbed)
                .then(msg => msg.channel).catch(() => {
                    return message.channel.send(`Sorry ${message.author}, but I couldn't direct message you!`)
                });
            }else{
                location = await message.author.send(discordServer)
                .then(msg => msg.channel).catch(() => {
                    return message.channel.send(`Sorry ${message.author}, but I couldn't direct message you!`)
                });
            }
            

            // collection
            const timeCollectionThing = {max: 1, time: 30000, errors: ["time"] };
            const collected = await location.awaitMessages(response => message.author === response.author, timeCollectionThing).catch(() => null);

            if (!collected){
                return message.author.send(`Sorry ${message.author}, but I've waited too long for a response from you--please try again later!`).then(message => message.delete({timeout: 5000, reason: "delete"}));
            }

            // get their answer
            var responseArray = collected.map(m => m.content);

            if (i == 0){
                // group id
                await axios.get(`https://groups.roblox.com/v1/groups/${responseArray[0]}`)
                    .then(function (response) {
                        group_id = response.data.id
                        group_name = response.data.name
                        member_count = response.data.memberCount
                    }).catch(() => {
                    return message.author.send(`Sorry ${message.author}, but can you please provide me with a real group ID`)
                });

                // if still 0 then error
                if (valid_group === false && group_id === 0){
                    var badEmbed = new Discord.MessageEmbed()
                        .setColor(0xf54242)
                        .setDescription(`Sorry ${message.author}, but that wasn't a valid group ID!`)
                    return message.author.send(badEmbed);
                }
            }else{
                // server code
                server_code = responseArray[0];
            }
        }

        await message.author.send(sentEmbed);
        
        var finalEmbed = new Discord.MessageEmbed()
            .setTitle(`**${group_name}'s Application**`)
            .addField(`Group ID`, `\`${group_id}\``, true)
            .addField(`Member Count`, `\`${member_count}\``, true)
            .addField(`Author ID`, `\`${message.author.id}\``, true)
            .addField(`Discord Server`, `[Join server - discord.gg/${server_code}](discord.gg/${server_code})`, true)

        // send application
		return client.channels.cache.get('705690679153786891').send(finalEmbed);
            
        
    }else{
        return message.channel.send(`Sorry ${message.author}, but you'll need to verify yourself first before I can start the application for you!\n**\`${client.config.prefix}verify username\`**`)
    }




};

exports.info = {
  name: "list",
  usage: "lisit <@mention>",
  description: "Whitelists (guild) owners to use the service in their guild",
};

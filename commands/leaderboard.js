const axios = require("axios");
const Discord = require("discord.js");
const admin = require("firebase-admin");
const rblxFunctions = require("noblox.js");


exports.run = async (client, message, args) => {
  var db = admin.database();

    // command can't be ran in dms
    if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`);

    // may take some time
    await message.channel.send(`This may take some time...`).then(message => message.delete({timeout: 5000, reason: "delete"}));

    // variables and map
    var group_name, group_id;
    var leaderboard_description = "";
    let leaderboard_unsorted = new Map();

    // map insertion
    await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}/users.json`)
        .then(function (response){
            for (var key in response.data){
                if (response.data.hasOwnProperty(key)){
                    // user_id, xp_amount
                    leaderboard_unsorted.set(Number(key), Number(response.data[key].xp));
                }
            }
        })
    
    // sort the map
    var leaderboard_sorted = new Map([... leaderboard_unsorted.entries()].sort((a, b) => b[1] - a[1]));

    // group information part 1 (gets the group name, group id)
    await axios.get(`${client.config.firebase_url}/guilds/${message.guild.id}.json`)
        .then(function (response){
            group_name = response.data.guild_settings.group_name;
            group_id = response.data.guild_settings.group_id;
        });
    
    // if size is 0, :{
    if (leaderboard_unsorted.size == 0){
        leaderboard_description = `**There are currently no user profiles stored in my database!**`
    } else {
        var counter = 0;

        // iterate through the map
        for (var [key, value] of leaderboard_sorted) {
            var rblx_username = await rblxFunctions.getUsernameFromId(key);
            leaderboard_description += `**\`${rblx_username}\` currently has \`${value}\` ${client.config.experience_name}**\n\n`;
            if (counter == 4) break;
            counter++;
        }
    }

    
    // embed produced
    var leaderboardEmbed = new Discord.MessageEmbed()
        .setColor(0xFF8C00)
        .setTitle(`__Top 5 Users__`)
        .setDescription(`${leaderboard_description}`)
        
    return message.channel.send(leaderboardEmbed);

};

exports.info = {
  names: ["leaderboard", "lb"],
  usage: "leaderboard",
  description: "Display the XP leaderboard for the group",
};

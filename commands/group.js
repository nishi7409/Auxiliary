// const axios = require("axios");
// const Discord = require("discord.js");
// const admin = require("firebase-admin");

// exports.run = async (client, message, args) => {
//   var db = admin.database();

//     // command can't be ran in dms
//     if (message.channel.type === "dm") return message.channel.send(`That command can't be used through direct messages!`);

//     var group_name, group_id, owner_id, premium_status, member_count, group_description, rblx_roles, firebase_roles;
    
//     // group information part 1 (gets the group name, group id, owner id, and premium status)
//     await axios.get(`https://auxiliary-f933f.firebaseio.com/guilds/${message.guild.id}.json`)
//         .then(function (response){
//             group_name = response.data.guild_settings.group_name;
//             group_id = response.data.guild_settings.group_id;
//             owner_id = response.data.guild_settings.owner_id;
//             premium_status = response.data.guild_settings.premium;
//         });

//     // group information part 2 (gets the member count + group description)
//     await axios.get(`https://groups.roblox.com/v1/groups/${group_id}`)
//         .then(function (response) {
//             member_count = response.data.memberCount;
//             group_description = response.data.description;
//         })
    
//     // group information part 3 (gets the roles)
//     await axios.get(`https://api.roblox.com/groups/${group_id}`)
//         .then(function (response) {
//             rblx_roles = response.data.Roles;
//         });
    
//     await axios.get(`https://auxiliary-f933f.firebaseio.com/guilds/${message.guild.id}.json`)
//         .then(function (response){
            
//         });
    

//     // first embed builder (all good!)
//     var firstEmbed = new Discord.MessageEmbed()
//         .setColor(0xFF8C00)
//         .setImage(group_thumbnail)
//         .setTitle(``)
//         .setDescription(`**Group Name: \`${group_name}\`\nOwner ID: \`${owner_id}\`\nMember Count: \`${member_count}\`\nDescription:\n\`\`\`${group_description}\`\`\`**`)
    
//     // second embed builder (need to work on rank/roles/xp requirement)
//     var secondEmbed = new Discord.MessageEmbed()
//         .setColor(0x28F6FF)
//         .addField(`${rank_name}`, `${client.config.experience_name}: **\`${required_amount}\`**\n ID: **\`${rank_id}\`**`)        

// };

// exports.info = {
//   name: "bind",
//   usage: "bind <#groupID>",
//   description: "Binds guild with a group",
// };

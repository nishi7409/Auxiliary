const axios = require('axios');
const Discord = require("discord.js");
const admin = require("firebase-admin");
const rblxFunctions = require("noblox.js");
const Util = require('../util');


exports.run = async (client, message, args, groupID) => {
    const latency = Math.round(message.client.ws.ping) + " ms";
    const PingEmbed = new Discord.MessageEmbed();
    PingEmbed.setTitle("Ping");
    PingEmbed.setDescription(`Latency: **${latency}**`);
    return message.channel.send(PingEmbed);
};

exports.info = {
    names: ["ping"],
    usage: 'ping!',
    description: "Returns the latency to the discord API"
};

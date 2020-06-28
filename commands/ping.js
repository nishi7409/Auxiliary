const axios = require('axios');
const Discord = require("discord.js");
const admin = require("firebase-admin");
const rblxFunctions = require("noblox.js");
const Util = require('../util');


exports.run = async (client, message, args, groupID) => {
    const latency = Math.round(message.client.ws.ping) + " ms";
    Util.CreateEmbed({name: "Ping", content: `Pong!\n${latency}`, embed_type: "Info", footer: "Ninja#0957"})
    .then(Embed => message.channel.send(Embed));
};

exports.info = {
    names: ["ping"],
    usage: 'ping!',
    description: "Returns the latency to the discord API"
};

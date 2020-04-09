/*
	Load in all packages and configuration files
*/
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const config = require("./settings/config.json");

/*
	Set a variable for the bot (in this instance, client)
*/
const client = new Discord.Client();
// Implement config to the client so the config is valid everywhere
client.config = config;

/*
	Events to be loaded in (message, memebrAdd, etc)
*/
fs.readdir("./events/", (err, files) => {
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});


// All valid commands
client.commands = new Enmap();

/*
	Commands to be loaded in (ping, verify, etc)
*/
fs.readdir("./commands/", (err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
    console.log(`Loaded command: ${commandName}`)
  });
});


// Client login
client.login(config.bot_token);
// Load in all packages and configuration files
const Discord = require("discord.js");
const Enmap = require("enmap");
const admin = require("firebase-admin");
const rblxFunctions = require("noblox.js");
const cron = require('node-cron');
const fs = require("fs");
var curl = require('curlrequest');
const localUpdater = require('./updater.js');

var serviceAccount = require("./settings/serviceAccountKey.json");
const config = require("./settings/config.json");

// Auto Updater. Will automatically run on application start. If auto update is set to false, no updates will commence.
curl.request({ url: 'https://raw.githubusercontent.com/nishi7409/Auxiliary/dev/package.json' }, function (err, file) {
  if (!err) {
    let requestedPackage = JSON.parse(file)
    let localPackage = require("./package.json")
    if (requestedPackage.version > localPackage.version) {
      if (config.auto_updates) {
        localUpdater.updateApplication()
      } else {
        console.warn("There is an update for auxillary, but you have turned auto updating off. Please manually review these updates.")
      }
    }
  }
});

// Setup so that you know if the bot is logged in. Mainly used to keep cookie validation running properly.
var loggedIn = false

// Set a variable for the bot (in this instance, client)
const client = new Discord.Client();

// Implement config to the client so the config is valid everywhere
client.config = config;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `${config.firebase_url}`
});

function rblx_login(){
  rblxFunctions.setCookie(config.rblx_cookie).then(function() {
    loggedIn = true
    console.log("logged in");
  })
  .catch(function(error) {
    console.log("There was an error when attempting to log in. " + error)
  })
  
}
rblx_login();

// Events to be loaded in (message, memebrAdd, etc)
fs.readdir("./events/", (err, files) => {
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

// All valid commands
client.commands = new Enmap();

// Commands to be loaded in (ping, verify, etc)
fs.readdir("./commands/", (err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    for (var e=0; e<props.info.names.length; e++) {
      client.commands.set(props.info.names[e], props);
    }
    let commandName = file.split(".")[0];
    console.log(`Loaded command: ${commandName}`)
  });
});

// Client login
client.login(config.bot_token);

// Initiate Cookie Refresh checking
cron.schedule('* 1 * * *', () => {
  if (loggedIn == true) {
    loggedIn = false
    rblxFunctions.refreshCookie().then(function(newCookie) {
      config.rblx_cookie = newCookie
      rblx_login();
      console.log("Cookie refreshed, validated and relogged in.")
    })
  }
});
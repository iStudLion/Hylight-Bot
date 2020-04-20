const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, RichEmbed } = require('discord.js');
const request = require('superagent');
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if(err) console.log(err);

	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if(jsfile.length <= 0) {
		console.log("No commands were registered");
		return;
	}

	var commandsCount = 0;
	jsfile.forEach((file, i) => {
		commandsCount += 1;
		let props = require("./commands/" + file);
		bot.commands.set(props.help.name, props);

	});
	console.log(commandsCount + " commands were registered");
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('on play.hylight.org');
});

client.on('guildMemberAdd', member => {
	var role = member.guild.roles.find('name', 'Traveler');
	member.addRole(role);
});

client.on('message', message => {
	let prefix = "!";
	let cmd = message.content.split(" ")[0];
	let args = message.content.split(" ").slice(1);

	let commandFile = bot.commands.get(cmd.slice(prefix.length));
	if(commandFile) commandFile.run(bot, message, args);

	/*var urlPattern = /(http:\/\/|https:\/\/|ftp:\/\/|file:\/\/)([A-Za-z0-9\.]+)?([\S]+)?/g;
	if(urlPattern.test(message.content)) {
		var allowedUrlPattern = /(http:\/\/|https:\/\/)([A-Za-z0-9\.]+)?(youtube\.com|hylight\.org|imgur\.com)([\S]+)?/g;
		if(!allowedUrlPattern.test(message.content)) {
			message.delete();
			message.channel.send({"embed": {"description": "Sorry, but you're not allowed to post URLs from this domain.","color": 5485304,"author": {"name": "URL in message not allowed"}}}).then(msg => msg.delete(6000));
		}
	}*/
});

client.login('NDg1MTM4MjkyODYyNjE1NTYy.DsE9DQ.W3sNOdT3XkPvb7cbcucMpT65O1I');
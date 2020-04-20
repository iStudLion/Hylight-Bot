const fs = require('fs');
const Discord = require('discord.js');
const prefix = "!", token = "NDg1MTM4MjkyODYyNjE1NTYy.Xpz68w.YDSgB5ZHauVC_HZ0COkzcn-aoEU";
const player = require("./player.js");
//const prefix = process.env.PREFIX, token = process.env.TOKEN;

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.prefix = prefix;

global.player = player;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if(typeof command.enabled == "undefined" || (typeof command.enabled == "boolean" && command.enabled == true)) {
		client.commands.set(command.name, command);
	}
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('on play.hylight.org');

	// client.guilds.cache.forEach(guild => {
	// 	guild.channels.cache.some(channel => {
	// 		if(channel.name.toLowerCase() == "verification") {
	// 			channel.send({
	// 				files: [{
	// 				  attachment: 'verification.png',
	// 				  name: 'verification.png'
	// 				}]
	// 			  }).then(a => {
	// 					channel.send({
	// 						content: "Greetings,\nWelcome to the Hylight Network official Discord server.\nTo gain access to all of the channels, you must first verify your account.\nThis process has unfortunately been implemented to obviate raiding and spam.\nTo verify your account, you must join our Minecraft server using `play.hylight.org` and execute `/connect discord` and open the link in your browser.\nThis link will be acclimated to connect your Discord account to your Minecraft account.\nAnd then you will receive a code, type `!verify <code>` with the code you have received to gain access to all of the features Hylight Network has to offer."
	// 					});
	// 			  });
	// 			return true;
	// 		}
	// 	});
	// });
});

// client.on('guildMemberAdd', member => {
// 	var role = member.guild.roles.find('name', 'Traveler');
// 	member.addRole(role);
// });

client.on('message', message => {
	if(message.content.startsWith(prefix) || message.author.bot) return;

	if(message.channel.name.toLowerCase() == "verification") {
		message.delete();
	}
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/\s+/);
	const command = args.shift().toLowerCase();

	if(command == "stop" && message.author.id == "227168930806890496") {
		message.delete();
		if(message.guild.channels.cache.some(channel => {
			if(channel.name.toLowerCase() == "logs") {
				channel.send({
					embed: {
						description: `<@${message.member.id}> stopped the bot.`,
						color: 16733525
					}
				});
				return true;
			}
		})) client.destroy();
		else client.destroy();

		return;
	}

	if(!client.commands.has(command)) {
		if(message.channel.name.toLowerCase() == "verification") {
			return message.delete();
		}
		
		message.channel.send({
			"embed": {
				"description": "Unknown Command. Try \"!help\" for a list of commands!",
				"color": 16733525
			}
		}).then(msg => {
			if(message.channel.name.toLowerCase() != "bot-commands") {
				message.delete({timeout: 10000});
				msg.delete({timeout:10000});
			}
		});
	} else {
		try {
			const cmd = client.commands.get(command);
			if(cmd.name.toLowerCase() == "verify") {
				if(message.channel.name.toLowerCase() == "verification") {
					if(message.member.roles.cache.size != 1) {
						return message.delete();
					}
				} else return message.delete();
 			} else {
				if(message.channel.name.toLowerCase() == "verification") {
					return message.delete();
				}

				if(typeof cmd.permissions == "object") {
					if(cmd.permissions.length > 0) {
						if(cmd.permissions.some(permission => !message.member.permissionsIn(message.channel).has(permission))) {
							return message.channel.send({
								embed: {
									description: "You don't have enough permissions to use this command.",
									color: 16733525
								}
							}).then(msg => {
								if(message.channel.name != "bot-commands") {
									if(!message.deleted) message.delete({timeout: 10000});
									if(!msg.deleted) msg.delete({timeout: 10000});
								}
							});
						}
					}
				}
	
				if(typeof cmd.global == "undefined" || (typeof cmd.global == "boolean" && cmd.global != true)) {
					if(message.channel.name.toLowerCase() != "bot-commands") {
						message.delete({timeout: 10000});
						message.channel.send({
							"embed": {
							"description": `I only respond to \`!${cmd.name}\` in #bot-commands channel.`,
							"color": 16733525
							}
						}).then(msg => msg.delete({timeout: 10000}));
						return;
					}
				}
			}

			// if its not returned, that means the person has permission
			cmd.execute(message, args);
		} catch(error) {
			console.error(error);
			message.channel.send({
				"embed": {
					"description": "There was an error executing your command!",
					"color": 16733525
				}
			}).then(msg => {
				if(message.channel.name.toLowerCase() != "bot-commands") {
					message.delete({timeout: 10000});
					msg.delete({timeout:10000});
				}
			});
		}
	}
});

client.login(token);
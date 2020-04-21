const fs = require('fs');
const Discord = require('discord.js');

const player = require("./player.js");
const prefix = process.env.PREFIX, token = process.env.TOKEN;

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

	client.guilds.cache.forEach(guild => {
		guild.channels.cache.some(channel => {
			// if(channel.name.toLowerCase() == "verification") {
			// 	channel.send({
			// 		files: [{
			// 		  attachment: 'verification.png',
			// 		  name: 'verification.png'
			// 		}]
			// 	  }).then(a => {
			// 			channel.send({
			// 				content: "Greetings,\nWelcome to the Hylight Network official Discord server.\nTo gain access to all of the channels, you must first verify your account.\nThis process has unfortunately been implemented to obviate raiding and spam.\nTo verify your account, you must join our Minecraft server using `play.hylight.org` and execute `/connect discord` and open the link in your browser.\nThis link will be acclimated to connect your Discord account to your Minecraft account.\nAnd then you will receive a code, type `!verify <code>` with the code you have received to gain access to all of the features Hylight Network has to offer."
			// 			});
			// 	  });
			// 	return true;
			// }
			
			// if(channel.name.toLowerCase() == "information") {
			// 	channel.send({
			// 		files: [{
			// 		  	attachment: './images/information.png',
			// 		  	name: 'information.png'
			// 		}]
			// 		}).then(a => {
			// 			const rulesChannel = guild.channels.cache.filter(ch => ch.name.toLowerCase() == "rules").first();
			// 			channel.send({
			// 				content: "Greetings, and welcome to the Hylight Network.\nThe Hylight Network is a Minecraft Java edition server network.\nHylight is intended to be a fun, welcoming and friendly environment for everyone.\nAs such, we have a list of rules we expect everyone to follow.\n\nGeneral rules can be found inside our <#"+rulesChannel.id+"> channel.\nThe list of all of the rules we have can be found on our documentation site.\n***NOTE**: Rules can change at any time without any proper notice.*\n\nYou can join our Minecraft server using `play.hylight.org`.\n\n**Useful Links**\n» Website: <https://www.hylight.org/>\n» Forums: <https://forum.hylight.org/>\n» Store: <https://store.hylight.org/>\n» Documentations: <https://docs.hylight.org/>\n» Jobs: <https://jobs.hylight.org/>"
			// 			});
			// 	  	});
			// 	return true;
			// }
			
			// if(channel.name.toLowerCase() == "rules") {
			// 	channel.send({
			// 		files: [{
			// 		  	attachment: './images/rules.png',
			// 		  	name: 'rules.png'
			// 		}]
			// 		}).then(a => {
			// 			channel.send({
			// 				content: "**Respect Everyone**\nEveryone has the right to be spoken to or addressed in a friendly, respectful manner. We encourage players to cooperate and compete in a positive environment, but never in a way that disrespects or abuses other players.\nBehaviors that are not allowed: discrimination, overuse of vulgar language, insults, encouragement of violence or hatred towards others, DDoS or DOX (includes threats), media advertisement without permission, spamming or chat-filter bypass.\n\n**Content Appropriation**\nHylight is intended to be a fun, welcoming and friendly environment for everyone. As such we highly encourage everyone to only post and/or use family-friendly content.\nInappropriate names or nicknames, profile picture, or contents are strongly prohibited. Our chat filter does its best to remove inappropriate content every time, and attempting to bypass it is punishable.\n\n**Punishment Evasion**\nPunishment evasion is not tolerated and will result in an IP ban on all our platforms. Using alternate accounts to evade mute or bans (or any type of punishment) is unacceptable and toxic behavior.\nIf you believe you were wrongfully punished, consider appealing instead.\n\n**Account & Safety**\nAs a Minecraft server, we do not have any control over your Minecraft or Discord account. However player safety is very important to us, so where possible we take steps to help protect our players from losing their accounts or otherwise being tricked or subjected to scams.\nPlease do **NOT** share your account details with anyone else. You are responsible for what happens to your account so make sure that your passwords are secure and that you never give them out to anyone."
			// 			});
			// 	  	});
			// 	return true;
			// }
		});
	});
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
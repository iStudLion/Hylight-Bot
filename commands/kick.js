const Discord = require("discord.js");
module.exports = {
    name: 'kick',
    description: 'kick user',
    global: true,
    permissions: ["KICK_MEMBERS"],
    /**
     * @param {Discord.Message} message 
     * @param {string} label
     * @param {Array} args 
     */
    execute(message, label, args) {
        if(args.length > 1) {
            if(message.mentions.members.size == 1) {
                if(!!args[0].match(/<@!\d{18,18}>/)) {
                    args.shift();
                    const reason = args.join(" ");
                    const target = message.mentions.members.first();
                    const invite = "https://discord.gg/5RBmG7s";
                    const PID = 0;

                    if(target.kickable) {
                        target.send({
                            embed: {
                              title: `Greetings ${target.user.username},`, 
                              description: `You were kicked from the Hylight Network Discord server for **${reason}**.\n\nBelow we've provided an invite link for you to join back.\nIf you believe you were wrongfully punished, please contact our support team.\n[support@hylight.org](mailto://support@hylight.org?subject=False%20Punishment%20%28ID%3A%20%23${PID}%29)\n\n${invite}`,
                              color: 5485304,
                              fields: [
                                {
                                  name: `Punishment ID`,
                                  value: `#${PID}`,
                                  inline:true
                                },
                                {
                                  name: `Executor`,
                                  value: `${message.member.displayName}`,
                                  inline:true
                                }
                              ]
                            }
                        }).then(kickMsg => {
                            target.kick(reason).then(() => {
                                var logsChannel = message.guild.channels.cache.filter(ch => (ch.type == "text" && ch.name.toLowerCase() == "logs")).first();
                                if(logsChannel) {
                                    logsChannel.send({
                                        embed: {
                                            description: `${target.user.tag} was kicked by <@${message.author.id}> for **${reason}**.`,
                                            color: 5485304
                                        }
                                    });
                                }
    
                                if(!message.deleted) message.delete();
                                message.channel.send({
                                    embed: {
                                        description: `${target.user.tag} was kicked for **${reason}**.`,
                                        color: 5485304
                                    }
                                });
                            }).catch(error => {
                                console.error(error);

                                kickMsg.delete();
                                
                                if(!message.deleted) message.delete({timeout: 10000});
                                return message.channel.send({
                                    embed: {
                                        description: `There was an error kicking <@${target.id}>.`,
                                        color: 16733525
                                    }
                                }).then(msg => msg.delete({timeout: 10000}));
                            });
                        }).catch(error => {
                            console.error(error);
                            target.kick(reason).then(() => {
                                var logsChannel = message.guild.channels.cache.filter(ch => (ch.type == "text" && ch.name.toLowerCase() == "logs")).first();
                                if(logsChannel) {
                                    logsChannel.send({
                                        embed: {
                                            description: `${target.tag} was kicked by <@${message.author.id}> for **${reason}**.`,
                                            color: 5485304
                                        }
                                    });
                                }
    
                                if(!message.deleted) message.delete();
                                message.channel.send({
                                    embed: {
                                        description: `${target.tag} was kicked for **${reason}**.`,
                                        color: 5485304
                                    }
                                });
                            }).catch(error => {
                                console.error(error);
                                
                                if(!message.deleted) message.delete({timeout: 10000});
                                return message.channel.send({
                                    embed: {
                                        description: `There was an error kicking <@${target.id}>.`,
                                        color: 16733525
                                    }
                                }).then(msg => msg.delete({timeout: 10000}));
                            });
                        });
                    } else {
                        if(!message.deleted) message.delete({timeout: 10000});
                        return message.channel.send({
                            embed: {
                                description: `<@${target.id}> could not be kicked.`,
                                color: 16733525
                            }
                        }).then(msg => msg.delete({timeout: 10000}));
                    }
                } else {
                    if(!message.deleted) message.delete({timeout: 10000});
                    return message.channel.send({
                        embed: {
                            description: `Invalid user. Try \`!${label} <@user> <reason>\` instead.`,
                            color: 16733525
                        }
                    }).then(msg => msg.delete({timeout: 10000}));
                }
            } else {
                if(!message.deleted) message.delete({timeout: 10000});
                return message.channel.send({
                    embed: {
                        description: `Invalid user. Try \`!${label} <@user> <reason>\` instead.`,
                        color: 16733525
                    }
                }).then(msg => msg.delete({timeout: 10000}));
            }
        } else {
            if(!message.deleted) message.delete({timeout: 10000});
            return message.channel.send({
                embed: {
                    description: `Not enough arguments. Try \`!${label} <@user> <reason>\` instead.`,
                    color: 16733525
                }
            }).then(msg => msg.delete({timeout: 10000}));
        }
    }
};
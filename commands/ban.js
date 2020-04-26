const Discord = require("discord.js");
module.exports = {
    name: 'ban',
    description: 'ban user',
    global: true,
    permissions: ["BAN_MEMBERS"],
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
                    const PID = randomStringGenerator(16);
                    const time = Math.floor(Date.now() / 1000);

                    if(target.bannable) {
                        target.send({
                            embed: {
                              title: `Greetings ${target.user.username},`, 
                              description: `You were banned from the Hylight Network Discord server for **${reason}**.\n\nIf you believe you were wrongfully punished, please contact our support team.\n[support@hylight.org](mailto://support@hylight.org?subject=False%20Punishment%20%28ID%3A%20%23${PID}%29)`,
                              color: 16733525,
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
                        }).then(banMsg => {
                            target.ban({reason: reason}).then(() => {
                                global.db.run("INSERT INTO `punishments` (id, user, executor, reason, type, time, expiration) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                                    PID,
                                    target.id,
                                    message.member.id,
                                    reason,
                                    "BAN",
                                    time,
                                    0
                                ], (r, e) => {
                                    if(r) console.log("RESULTS: ",r);
                                    if(e) console.error("ERROR: ",e);
                                });

                                var logsChannel = message.guild.channels.cache.filter(ch => (ch.type == "text" && ch.name.toLowerCase() == "logs")).first();
                                if(logsChannel) {
                                    logsChannel.send({
                                        embed: {
                                            description: `${target.user.tag} was banned by <@${message.author.id}> for **${reason}**.`,
                                            color: 5485304
                                        }
                                    });
                                }
    
                                if(!message.deleted) message.delete();
                                message.channel.send({
                                    embed: {
                                        description: `${target.user.tag} was banned for **${reason}**.`,
                                        color: 5485304
                                    }
                                });
                            }).catch(error => {
                                console.error(error);

                                banMsg.delete();
                                
                                if(!message.deleted) message.delete({timeout: 10000});
                                return message.channel.send({
                                    embed: {
                                        description: `There was an error banning <@${target.id}>.`,
                                        color: 16733525
                                    }
                                }).then(msg => msg.delete({timeout: 10000}));
                            });
                        }).catch(error => {
                            console.error(error);
                            target.ban({reason: reason}).then(() => {
                                global.db.run("INSERT INTO `punishments` (id, user, executor, reason, type, time, expiration) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                                    PID,
                                    target.id,
                                    message.member.id,
                                    reason,
                                    "BAN",
                                    time,
                                    0
                                ], (r, e) => {
                                    if(r) console.log("RESULTS: ",r);
                                    if(e) console.error("ERROR: ",e);
                                });

                                var logsChannel = message.guild.channels.cache.filter(ch => (ch.type == "text" && ch.name.toLowerCase() == "logs")).first();
                                if(logsChannel) {
                                    logsChannel.send({
                                        embed: {
                                            description: `${target.tag} was banned by <@${message.author.id}> for **${reason}**.`,
                                            color: 5485304
                                        }
                                    });
                                }
    
                                if(!message.deleted) message.delete();
                                message.channel.send({
                                    embed: {
                                        description: `${target.tag} was banned for **${reason}**.`,
                                        color: 5485304
                                    }
                                });
                            }).catch(error => {
                                console.error(error);
                                
                                if(!message.deleted) message.delete({timeout: 10000});
                                return message.channel.send({
                                    embed: {
                                        description: `There was an error banning <@${target.id}>.`,
                                        color: 16733525
                                    }
                                }).then(msg => msg.delete({timeout: 10000}));
                            });
                        });
                    } else {
                        if(!message.deleted) message.delete({timeout: 10000});
                        return message.channel.send({
                            embed: {
                                description: `<@${target.id}> could not be banned.`,
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
const Discord = require("discord.js");
module.exports = {
    name: "clear",
    description: "clear messages",
    global: true,
    aliases: ["purge"],
    permissions: ["MANAGE_MESSAGES"],
    /**
     * @param {Discord.Message} message 
     * @param {string} label
     * @param {Array} args 
     */  
    execute(message, label, args) {
        if(args.length > 0) {
            if(args.length == 1) {
                if(!isNaN(args[0])) {
                    const amount = parseInt(args[0]);
                    if(amount > 0 && amount <= 100) {
                        message.delete().then(() => {
                            message.channel.bulkDelete(amount, true).then(deleted => {
                                message.guild.channels.cache.some(channel => {
                                    if(channel.name.toLowerCase() == "logs") {
                                        channel.send({
                                            embed: {
                                                description: `<@${message.member.id}> deleted ${deleted.size} ${(deleted.size > 1 ? "messages" : "message")} in <#${message.channel.id}>.`,
                                                color: 5485304
                                            }
                                        });
                                        return true;
                                    }
                                });

                                message.channel.send({
                                    embed: {
                                        description: `Successfully removed ${deleted.size} ${(deleted.size > 1 ? "messages" : "message")}.`,
                                        color: 5485304
                                    }
                                }).then(msg => msg.delete({timeout: 10000}));
                            }).catch(err => {
                                console.error(err);
                                message.channel.send({
                                    embed: {
                                        description: "There was an error removing the messages.",
                                        color: 16733525
                                    }
                                }).then(msg => msg.delete({timeout: 10000}));
                            });
                        });
                    } else {
                        if(!message.deleted) message.delete({timeout: 10000});
                        return message.channel.send({
                            embed: {
                                description: (amount > 100 ? "You can't delete more than 100 messages." : "The amount of messages to delete can not be less than 1."),
                                color: 16733525
                            }
                        }).then(msg => msg.delete({timeout: 10000}));
                    }
                } else if(message.mentions.users.size == 1) {
                    if(!message.deleted) message.delete({timeout: 10000});
                    return message.channel.send({
                        embed: {
                            description: `Not enough arguments. Try \`!${label} [@user] <amount>\` instead.`,
                            color: 16733525
                        }
                    }).then(msg => msg.delete({timeout: 10000}));
                } else {
                    if(!message.deleted) message.delete({timeout: 10000});
                    return message.channel.send({
                        embed: {
                            description: `Not enough arguments. Try \`!${label} [@user] <amount>\` instead.`,
                            color: 16733525
                        }
                    }).then(msg => msg.delete({timeout: 10000}));
                }
            } else if(args.length == 2) {
                const member = message.mentions.members.size > 0 ? message.mentions.members.first() : null;
                const amount = !isNaN(args[1]) ? parseInt(args[1]) : !isNaN(args[0])? parseInt(args[0]) : null;
                    if(member != null) {
                        if(amount != null) {
                            if(amount > 0 && amount <= 100) {
                                message.delete().then(() => {
                                    message.channel.messages.fetch().then(messages => {
                                        let i = 0;
                                        message.channel.bulkDelete(messages.filter(m => {
                                            if(m.author.id == member.id && !m.deleted && m.deletable) {
                                                i++;
                                                return i <= amount;
                                            }
                                        }), true).then(deleted => {
                                            message.guild.channels.cache.some(channel => {
                                                if(channel.name.toLowerCase() == "logs") {
                                                    channel.send({
                                                        embed: {
                                                            description: `<@${message.member.id}> deleted ${deleted.size} ${(deleted.size > 1 ? "messages" : "message")} from <@${member.id}> in <#${message.channel.id}>.`,
                                                            color: 5485304
                                                        }
                                                    });
                                                    return true;
                                                }
                                            });
    
                                            message.channel.send({
                                                embed: {
                                                    description: `Successfully removed ${deleted.size} ${(deleted.size > 1 ? "messages" : "message")} from <@${member.id}>`,
                                                    color: 5485304
                                                }
                                            }).then(msg => msg.delete({timeout: 10000}));
                                        }).catch(err => {
                                            console.error(err);
                                            message.channel.send({
                                                embed: {
                                                    description: "There was an error removing the messages.",
                                                    color: 16733525
                                                }
                                            }).then(msg => msg.delete({timeout: 10000}));
                                        });
                                    }).catch(error => {
                                        console.error(error);
                                        message.channel.send({
                                            embed: {
                                                description: "There was an error removing the messages.",
                                                color: 16733525
                                            }
                                        }).then(msg => msg.delete({timeout: 10000}));
                                    });
                                });
                            } else {
                                if(!message.deleted) message.delete({timeout: 10000});
                                return message.channel.send({
                                    embed: {
                                        description: (amount > 100 ? "You can't delete more than 100 messages." : "The amount of messages to delete can not be less than 1."),
                                        color: 16733525
                                    }
                                }).then(msg => msg.delete({timeout: 10000}));
                            }
                        } else {
                            if(!message.deleted) message.delete({timeout: 10000});
                            return message.channel.send({
                                embed: {
                                    description: `Invalid amount. Try \`!${label} [@user] <amount>\` instead.`,
                                    color: 16733525
                                }
                            }).then(msg => msg.delete({timeout: 10000}));
                        }
                    } else {
                        if(!message.deleted) message.delete({timeout: 10000});
                        return message.channel.send({
                            embed: {
                                description: `Invalid user. Try \`!${label} [@user] <amount>\` instead.`,
                                color: 16733525
                            }
                        }).then(msg => msg.delete({timeout: 10000}));
                    }
            } else {
                if(!message.deleted) message.delete({timeout: 10000});
                return message.channel.send({
                    embed: {
                        description: `Too many arguments. Try \`!${label} [@user] <amount>\` instead.`,
                        color: 16733525
                    }
                }).then(msg => msg.delete({timeout: 10000}));
            }
        } else {
            if(!message.deleted) message.delete({timeout: 10000});
            return message.channel.send({
                embed: {
                    description: `Not enough arguments. Try \`!${label} [@user] <amount>\` instead.`,
                    color: 16733525
                }
            }).then(msg => msg.delete({timeout: 10000}));
        }
	}
};
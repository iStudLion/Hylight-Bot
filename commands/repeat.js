const Discord = require("discord.js");
module.exports = {
    name: "repeat",
    description: "reapeat music",
    /**
     * @param {Discord.Message} message 
     * @param {string} label
     * @param {Array} args 
     */
    execute(message, label, args) {
        if (args.length == 0) {
            if (!message.member.voice.channel || message.member.voice.channel.name.toLowerCase() != "music") {
                return message.channel.send({
                    embed: {
                        description: "You need to be the Music voice channel to execute this command.",
                        color: 14963796
                    }
                });
            }

            if (global.player.queue.length > 0) {
                song = global.player.queue[0];
                if (typeof song.repeat == "boolean" && global.player.queue[0].repeat == true) global.player.queue[0].repeat = false;
                else global.player.queue[0].repeat = true;

                message.channel.send({
                    embed: {
                        description: `Repeat mode ${(global.player.queue[0].repeat ? "enabled" : "disabled")} for:`,
                        color: 5485304,
                        footer: {
                            icon_url: song.cover,
                            text: song.title
                        }
                    }
                })
            } else {
                message.channel.send({
                    embed: {
                        description: `There's no song in queue to repeat.`,
                        color: 16733525
                    }
                });
            }
        } else if (args.length == 1 && (args[0].toLowerCase() == "?" || args[0].toLowerCase() == "help")) {
            return message.channel.send({
                embed: {
                    title: `Help for \`!${label}\`:`,
                    description: `Toggles repeat for currenly playing song\n**Usage**: \`!${label}\``,
                    color: 5485304
                }
            }).then(msg => msg.delete({ timeout: 5000 }));
        } else {
            if (!message.member.voice.channel || message.member.voice.channel.name.toLowerCase() != "music") {
                return message.channel.send({
                    embed: {
                        description: "You need to be the Music voice channel to execute this command.",
                        color: 14963796
                    }
                });
            }

            return message.channel.send({
                embed: {
                    description: `Incorrect usage. Try \`!${label} help\` for help.`,
                    color: 16733525
                }
            });
            /*.then(msg => {
                if (message.channel.name.toLowerCase() != "bot-commands") {
                    setTimeout(() => {
                        if (!message.deleted && message.deletable) message.delete();
                        if (!msg.deleted && message.deletable) message.delete();
                    }, 10000);
                }
            });*/
        }
    }
}
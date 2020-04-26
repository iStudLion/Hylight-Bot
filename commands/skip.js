const Discord = require("discord.js");
module.exports = {
    name: "skip",
    description: "skip music",
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

                if (song.connection) {
                    if (song.connection.dispatcher) {
                        song.connection.dispatcher.end();

                        message.channel.send({
                            embed: {
                                description: `Skipping song`,
                                color: 5485304,
                                footer: {
                                    icon_url: song.cover,
                                    text: song.title
                                }
                            }
                        });
                    } else {
                        global.player.play(connection, message);
                    }
                } else {
                    message.channel.send({
                        embed: {
                            description: `There's no song playing.`,
                            color: 16733525
                        }
                    });
                }
            } else {
                message.channel.send({
                    embed: {
                        description: `There's no song in queue to skip.`,
                        color: 16733525
                    }
                });
            }
        } else if (args.length == 1 && (args[0].toLowerCase() == "?" || args[0].toLowerCase() == "help")) {
            return message.channel.send({
                embed: {
                    title: `Help for \`!${label}\`:`,
                    description: `Skips the song that's currently playing.\n**Usage**: \`!${label}\``,
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
        }
    }
}
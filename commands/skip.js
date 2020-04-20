const Discord = require("discord.js");
module.exports = {
    name: "skip",
    description: "skip playing music",
    /**
     * @param {Discord.Message} message
     * @param {Array} args
     */
    execute: async (message, args) => {
        if(!message.member.voice.channel || message.member.voice.channel.name.toLowerCase() != "music") {
            return message.channel.send({
                embed: {
                    description: "You need to be the Music voice channel to execute this command.",
                    color: 14963796
                }
            });
        }
        
        if(global.player.queue.length > 0) {
            song = global.player.queue[0];

            if(song.connection) {
                if(song.connection.dispatcher) {
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
    }
}
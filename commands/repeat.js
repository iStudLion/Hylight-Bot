const Discord = require("discord.js");
module.exports = {
    name: "repeat",
    description: "reapeat music",
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
            if(typeof song.repeat == "boolean" && global.player.queue[0].repeat == true) global.player.queue[0].repeat = false;
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
    }
}
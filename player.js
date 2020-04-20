const Discord = require("discord.js");

module.exports = {
    queue: [],
    /** 
     * @param {string} query
    */
    play: () => {
        
    },
    /**
     * @param {Discord.Message} message
     * @param {Object} song
     */
    addToQueue(message, song) {
        if(typeof song != "object") throw new Exception("song param must be an object");
        if(typeof song.id != "string") throw new Exception("Song id must be a string");
        if(typeof song.title != "string") throw new Exception("Song title must be a string");
        if(typeof song.cover != "string") throw new Exception("Song cover must be a string");
        if(typeof song.description != "string") throw new Exception("Song description must be a string");
        if(typeof song.requested_by != "object") throw new Exception("Song requested_by must be an object");
        // check if song is valid

        this.queue.push(song);

        let response = {
            embed: {
                title: "ADDED TO QUEUE:",
                description: `[**${song.title}**](https://www.youtube.com/watch?v=${song.id})\n${song.description}`,
                color: 5485304,
                footer: {
                    text: `Requested by ${song.requested_by.displayName}`
                },
                thumbnail: {
                    url: song.cover
                }
            }
        };
        if(message.editable) message.edit(response);
        else {
            message.delete();
            message.channel.send(response);
        }
    }
}
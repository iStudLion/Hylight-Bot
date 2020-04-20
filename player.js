const Discord = require("discord.js");
const ytdl = require('ytdl-core');

module.exports = {
    queue: [],
    /** 
     * @param {Discord.VoiceConnection} connection
     * @param {Discord.Message} message
    */
    play: (connection, message) => {
        if(global.player.queue.length > 0) {
            const song = global.player.queue[0];
            const url = "https://youtube.com/watch?v="+song.id;

            const stream = ytdl(url, { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            dispatcher.on('start', () => {
                global.player.queue[0].connection = connection;
                if(typeof song.repeat == "undefined" || (typeof song.repeat == "boolean" && song.repeat != true)) {
                    let response = {
                        embed: {
                            title: "NOW PLAYING:",
                            description: `[**${song.title}**](https://www.youtube.com/watch?v=${song.id})\n${song.description.replace(/(https?):\/\//gi, "$1:\\/\\/")}`,
                            color: 5485304,
                            footer: {
                                text: `Requested by ${song.requested_by}`
                            },
                            thumbnail: {
                                url: song.cover
                            }
                        }
                    };
    
                    message.channel.messages.fetch({ limit: 1 }).then(messages => {
                        if(!messages.some(msg => {
                            if(msg.id == message.id && msg.editable) {
                                msg.edit(response);
                                return true;
                            }
                        })) message.channel.send(response);
                    });
                }
            });

            dispatcher.on('error', (error) => {
                console.error(error);

                delete global.player.queue[0].connection;

                message.channel.send({
                    embed: {
                        description: `An error occured whilst playing '${song.title}'.`,
                        color: 16733525
                    }
                }).then(() => {
                    if(typeof song.repeat == "undefined" || (typeof song.repeat == "boolean" && song.repeat != true)) {
                        global.player.queue.shift();
                    }

                    if(global.player.queue.length < 1) {
                        connection.disconnect();
                        return;
                    }

                    global.player.play(connection, message);
                });
            });

            dispatcher.on("finish", () => {
                delete global.player.queue[0].connection;

                if(typeof song.repeat == "undefined" || (typeof song.repeat == "boolean" && song.repeat != true)) {
                    global.player.queue.shift();
                }
                
                if(global.player.queue.length < 1) {
                    connection.disconnect();
                    return;
                }

                global.player.play(connection, message);
            });

            // try {
            //     ytdl.getInfo(url, { filter: 'audioonly' }, (err, inf) => {
            //         if (err) console.error(err);
            //         else {
            //             console.log(JSON.stringify(inf));
            //             return;
    
                        
            //         }
            //     });
            // } catch(error) {
            //     console.error(error);
            // }
        } else {
            connection.disconnect();
        }
    },
    /**
     * @param {Discord.Message} message
     * @param {Object} song
     */
    addToQueue(message, song) {
        if(typeof song != "object") throw "song param must be an object";
        if(typeof song.id != "string") throw "Song id must be a string";
        if(typeof song.title != "string") throw "Song title must be a string";
        if(typeof song.cover != "string") throw "Song cover must be a string";
        if(typeof song.description != "string") throw "Song description must be a string";
        if(typeof song.requested_by == "undefined") throw "Song requested_by must not be undefined";
        // check if song is valid

        if(!message.client.voice.connections.filter(vc => vc.channel.guild.id == message.guild.id).some(vc => {
            // stop when a music channel is reached
            if(vc.channel.name.toLowerCase() == "music") {
                // already has a voice connection, just ignore and return true
                return true;
            }
        })) {
            // client is not in voicechannel
            if(!message.guild.channels.cache.filter(channel => channel.type == "voice").some(channel => {
                if(channel.name.toLowerCase() == "music") {
                    // establish a new voice connection
                    channel.join().then(connection => {
                        global.player.play(connection, message);
                    }).catch(console.error);
                    return true;
                }
            })) {
                // no music channel found
                message.guild.channels.cache.filter(channel => channel.type == "text").some(channel => {
                    if(channel.name.toLowerCase() == "logs") {
                        channel.send({
                            embed: {
                                description: `Bot couldn't establish a voice connection, as no voice channel named "Music" was found.`,
                                color: 16733525
                            }
                        });
                        return true;
                    }
                })
            }
        }
        global.player.queue.push(song);

        let response = {
            embed: {
                title: "ADDED TO QUEUE:",
                description: `[**${song.title}**](https://www.youtube.com/watch?v=${song.id})\n${song.description}`,
                color: 5485304,
                footer: {
                    text: `Requested by ${song.requested_by}`
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
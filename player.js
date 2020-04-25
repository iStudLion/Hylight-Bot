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
            global.player.queue[0].connection = connection;

            const song = global.player.queue[0];
            const url = "https://youtube.com/watch?v="+song.id;

            const stream = ytdl(url, { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            dispatcher.on('start', () => {
                if(connection.channel.members.filter(member => !member.user.bot).size > 0) {
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
                } else {
                    if(global.player.queue.length > 0) global.player.queue = [];
                    connection.disconnect();
                }
            });

            dispatcher.on('error', (error) => {
                console.error(error);
                if(global.player.queue.length > 0 && connection.channel.members.filter(member => !member.user.bot).size > 0) {
                    if(global.player.queue[0].connection) delete global.player.queue[0].connection;
    
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
                } else {
                    if(global.player.queue.length > 0) global.player.queue = [];
                    connection.disconnect();
                }
            });

            dispatcher.on("finish", () => {
                if(global.player.queue.length > 0 && connection.channel.members.filter(member => !member.user.bot).size > 0) {
                    if(global.player.queue[0].connection) delete global.player.queue[0].connection;
    
                    if(typeof song.repeat == "undefined" || (typeof song.repeat == "boolean" && song.repeat != true)) {
                        global.player.queue.shift();
                    }
                    
                    if(global.player.queue.length < 1) {
                        connection.disconnect();
                        return;
                    }
    
                    global.player.play(connection, message);
                } else {
                    if(global.player.queue.length > 0) global.player.queue = [];
                    connection.disconnect();
                }
            });
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

        if(!message.guild.voice || (message.guild.voice && !message.guild.voice.channel)) {
            // client is not in voicechannel
            const musicChannel = message.member.voice.channel && message.member.voice.channel.name.toLowerCase() == "music" ? message.member.voice.channel : message.guild.channels.cache.filter(channel => channel.type == "voice" && channel.name.toLowerCase() == "music").first();
            if(musicChannel && musicChannel.members.size > 0) {
                musicChannel.join().then(connection => {
                    global.player.play(connection, message);
                }).catch(error => {
                    console.error(error);
                    message.channel.send({
                        embed: {
                            description: `Bot couldn't establish a voice connection.`,
                            color: 16733525
                        }
                    });

                    try { musicChannel.leave(); }
                    catch(ignore) {}
                });
            } else {
                message.channel.send({
                    embed: {
                        description: `You must be in Music channel to play music.`,
                        color: 16733525
                    }
                });
                return;
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
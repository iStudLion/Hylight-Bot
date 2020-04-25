const Discord = require("discord.js");
const key = "AIzaSyAXL-mp6UCOPFmmYTzKz3BXhulUP0oJE3s";
const superagent = require("superagent");

module.exports = {
    name: "play",
    description: "play music",
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

        if(args.length != 0) {
            if(args.length == 1 && isURL(args[0])) {
                // argument is URL
                if(!!args[0].match("/^https?://([a-z0-9_]+\.)(youtu.be|youtube.com)/i")) {
                    // url is from youtube
                    const url = args[0];
                    var id = url.match("v=([a-zA-Z0-9\_\-]+)&?")[1];
                    var list = url.match("list=([a-zA-Z0-9\-\_]+)&?");
                    list = list ? list[1] : false;

                } else {
                    // url is not from youtube
                }
            } else {
                // arguments is a search query
                const query = args.join(" ");
                message.channel.send({
                    "embed": {
                      "description": `Searching for "${query}"...`,
                      "color": 5485304
                    }
                }).then(async (msg) => {
                    await superagent.get('https://www.googleapis.com/youtube/v3/search')
                    .query({ key: key, type: "video", q: query, part: "snippet", type: "video", fields: "items/snippet/title,items/snippet/description,items/snippet/thumbnails/high/url,items/id/videoId" })
                    .set('Accept', 'application/json')
                    .then(async (response) => {
                        var YT = response.body;
                        if(YT.items.length > 0) {
                            // prepare a new HTTP request to MusicEngine
                            let stripped_title = YT.items[0].snippet.title.replace(/( ?[\[\{\(] ?(?:(?:video|.*?remix|karaoke|lyrics?|.*?version.*?)? ?(?:off?icial)? ?(?:audio|(?:music|lyrics?)? ?video)?)[\]\)\}])/gi, '').replace(/[/\\:\*\?"<>\|]/g, ''),
                            description = YT.items[0].snippet.description.replace(/(https?):\/\//gi, "$1:\\/\\/");

                            await superagent.get('http://api.musicengine.co/search')
                            .query({ token: 'wGWdNR7idwDR6gN5uRru6aHlpg5NSnRT', q: stripped_title })
                            .set('Accept', 'application/json')
                            .then(async (response) => {
                                var ME = response.body;
                                if(ME.response.results > 0) {
                                    global.player.addToQueue(msg, {
                                        id: YT.items[0].id.videoId,
                                        title: ME.response.hits[0].song.titles.title_full,
                                        description: description,
                                        cover: ME.response.hits[0].song.album.cover,
                                        requested_by: message.member.displayName
                                    });
                                } else {
                                    global.player.addToQueue(msg, {
                                        id: YT.items[0].id.videoId,
                                        title: YT.items[0].snippet.title,
                                        description: YT.items[0].snippet.description,
                                        cover: YT.items[0].snippet.thumbnails.high.url,
                                        requested_by: message.member.displayName
                                    });
                                }
                            }).catch((error) => {
                                console.error(error);
                                global.player.addToQueue(msg, {
                                    id: YT.items[0].id.videoId,
                                    title: YT.items[0].snippet.title,
                                    description: YT.items[0].snippet.description,
                                    cover: YT.items[0].snippet.thumbnails.high.url,
                                    requested_by: message.member.displayName
                                });
                            });
                        } else {
                            let response = {
                                embed: {
                                    description: `No results were for found for "${query}".`,
                                    color: 14963796
                                }
                            };

                            if(msg.editable) msg.edit(response);
                            else {
                                msg.delete();
                                msg.channel.send(response);
                            }
                        }
                    }).catch(error => {
                        console.error(error);
                        let response = {
                            embed: {
                              description: `There was an error grabbing results for "${query}".`,
                              color: 14963796
                            }
                        };

                        if(msg.editable) msg.edit(response);
                        else {
                            msg.delete();
                            msg.channel.send(response);
                        }
                    });
                });
            }
        } else {
            message.channel.send({
                embed: {
                    description: `Not enough arguments. Try \`!play <query...>\` instead.`,
                    color: 16733525
                }
            });
        }
    }
}

function isURL(string) {
    var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(string);
}
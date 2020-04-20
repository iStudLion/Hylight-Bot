const Discord = require("discord.js");
module.exports = {
	name: 'verify',
    description: 'verify account',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
	execute(message, args) {
        message.delete().catch(() => {});

        if(args.length == 1) {
            message.channel.send({
                embed: {
                    description: `<@${message.author.id}> your verification code has been validated.`,
                    color: 5635925
                }
            }).then(msg => msg.delete({timeout: 5000}));
        } else {
            message.channel.send({
                embed: {
                    description: `<@${message.author.id}> the verification code you have provided is invalid.`,
                    color: 16733525
                }
            }).then(msg => msg.delete({timeout: 5000}));
        }
	},
};
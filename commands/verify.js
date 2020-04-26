const Discord = require("discord.js");
module.exports = {
	name: 'verify',
    description: 'verify account',
    /**
     * @param {Discord.Message} message 
     * @param {string} label
     * @param {Array} args 
     */
    execute(message, label, args) {
        message.delete().catch(() => { });

        if (args.length == 1 && (args[0].toLowerCase() == "?" || args[0].toLowerCase() == "help")) {
            return message.channel.send({
                embed: {
                    title: `Help for \`!${label}\`:`,
                    description: `Verifies you're an actual player\n**Usage**: \`!${label} <code>\``,
                    color: 5485304
                }
            }).then(msg => msg.delete({ timeout: 5000 }));
        }

        if (args.length == 1) {
            message.channel.send({
                embed: {
                    description: `<@${message.author.id}> your verification code has been validated.`,
                    color: 5635925
                }
            }).then(msg => msg.delete({ timeout: 5000 }));
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
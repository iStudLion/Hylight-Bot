module.exports = {
	name: 'help',
    description: 'list of all commands',
	execute(message, args) {
        var commands = [];
        message.client.commands.some(command => {
            if(typeof command.permissions == "object") {
                if(command.permissions.length > 0) {
                    if(!command.permissions.some(permission => !message.member.permissionsIn(message.channel).has(permission))) {
                        commands.push(command);
                    }
                } else {
                    commands.push(command);
                }
            } else {
                commands.push(command);
            }
        });

        var response = {
            embed: {
                description: "Please read our [Discord documentation](https://docs.hylight.org/discord) for more information.",
                color: 5485304,
                author: {
                    name: "List of commands"
                },
                fields: []
            }
        };

        commands.forEach(command => {
            if(command.name.toLowerCase() != "verify") {
                response.embed.fields.push({
                    "name": message.client.prefix+command.name.toLowerCase(),
                    "value": command.description,
                    "inline": true
                });
            }
        });
        
        message.channel.send(response);
	},
};
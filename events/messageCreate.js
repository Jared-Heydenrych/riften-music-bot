const { MessageEmbed } = require("discord.js");

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;
    const { prefix } = client.config;
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if(!prefixRegex.test(message.content)) return;
    const [ , matchedPrefix] = message.content.match(prefixRegex);
    const [ cmdName, ...args ] = message.content.slice(matchedPrefix.length).trim().split(/ +g/);
    if (args.length == 0) {
        if (matchedPrefix.includes(client.user.id)) {
            return message.reply({
                embeds: [
                    new MessageEmbed().setColor("BLUE")
                    .setTitle(`👍 **To see all Commands, type: \`${prefix}help\` / \`/help\`**`)
                ]
            }).catch(() => null);
        }
    }

    const cmd = client.commands.get(cmdName.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmdName.toLowerCase()));
    if(!cmd) return;
    try {
        cmd.run(client, message, args, prefix);
    } catch (error) {
        console.error(error);
        message.channel.send(`❌ Something went wrong, while running the ${cmd.name} Command`).catch(() => null);
    }
}

function escapeRegex(str) {
    return str.replace(/[.*+?^{}()|[\]\\]/g, `\\$&`);
}
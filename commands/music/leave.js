const { getVoiceConnection } = require("@discordjs/voice");
const { Permissions, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "leave",
    aliases: ["stopleave", "leavestop"],
    description: "Leaves a voice channel",
    run: async (client, message, args, prefix) => {
        try {
            if(!message.member.voice.channelId) return message.reply({ content: `👎 **Please join a Voice-Channel first!**`}).catch(() => null);
        
            //try to get the old connection
            const oldConnection = getVoiceConnection(message.guild.id);

            //if we have an old connection
            if(oldConnection) return message.reply({ content: `👎 **I am not connected somewhere!**`}).catch(() => null);

            await client.leaveVoiceChannel(message.member.voice.channel);
            message.reply({ content: `:wave: **Left your VC!**`}).catch(() => null);
        } catch (error) {
            //if we get an error, we will reply with it.
            console.error(error);
            message.reply({
                content: `❌ **Could not leave your VC because:** \`\`\`${String(error?.message || error).substring(0, 1900)}\`\`\``
            }).catch(() => null);
        }
    }
}
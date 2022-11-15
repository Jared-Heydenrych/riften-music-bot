const { getVoiceConnection } = require("@discordjs/voice");
const { Permissions, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "join",
    description: "Joins a voice channel",
    run: async (client, message, args, prefix) => {
        try {
            if(!message.member.voice.channelId) return message.reply({ content: `👎 **Please join a Voice-Channel first!**`}).catch(() => null);
        
            //try to get the old connection
            const oldConnection = getVoiceConnection(message.guild.id);

            //if we have an old connection
            if(oldConnection) return message.reply({ content: `👎 **I am already connected in <#${oldConnection.joinConfig.channelId}>!**`}).catch(() => null);
            
            //check for permissions
            //if it does not have permissions to connect, will return this error.
            if(!message.member.voice.channel?.permissionsFor(message.guild?.me).has(PermissionFlagsBits.Connect)) {
                return message.reply({ content: `👎 **I'm missing the permissions to connect to your VC!**`}).catch(() => null);
            }

            //if it does not have permissions to speak, will return this error.
            if(!message.member.voice.channel?.permissionsFor(message.guild?.me).has(PermissionFlagsBits.Speak)) {
                return message.reply({ content: `👎 **I'm missing the permissions to speak in your VC!**`}).catch(() => null);
            }

            await client.joinVoiceChannel(message.member.voice.channel);
            message.reply({ content: `✅ **Joined your VC!**`}).catch(() => null);
        } catch (error) {
            //if we get an error, we will reply with it.
            console.error(error);
            message.reply({
                content: `❌ **Could not join your VC because:** \`\`\`${String(error?.message || error).substring(0, 1900)}\`\`\``
            }).catch(() => null);
        }
    }
}
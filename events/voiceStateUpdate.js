const { Permissions } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");


module.exports = async (client, oldState, newState) => {
    //Stage Channel self suspressing false
    if(newState.id == client.user.id && newState.channelId && newState.channel.type == "GUILD_STAGE_VOICE" && newState.suppress) {
        if(newState.channel?.permissionsFor(newState.guild.me)?.has(Permissions.FLAGS.MUTE_MEMBERS)) {
            await newState.guild.me.voice.setSuppressed(false).catch(() => null);
        }
    }

    if(newState.id == client.user.id) return;

    // Destroy voiceconnection, if channel has no more listeners.
    function stateChange(one, two) {
        if(one == false && two === true || one === true && two === false) return true;
        else return false;
    }

    const o = oldState, n = newState;
}
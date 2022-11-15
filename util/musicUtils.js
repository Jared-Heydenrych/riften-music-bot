const Discord = require("discord.js");
const dcYtdl =  require("discord-ytdl-core");
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior, entersState } =  require("@discordjs/voice");
const { default: YouTube} = require("youtube-sr");

module.exports = client => {
    //m2(7) = 07
    const m2 = t => parseInt(t) < 10 ? `0${t}` : `${t}`
    // 99 = 099 or 1 = 001
    //if you want to format milliseconds to a 3 letter number.
    const m3 = t => parseInt(t) < 100 ? `0${m2(t)}` : `${t}`

    client.formatDuration = (ms) => {
        const sec = parseInt(ms / 1000 % 60);
        const min = parseInt(ms / (1000*60) % 60);
        const hr = parseInt(ms / (1000*60*60) % 24);

        if(sec >= 60) {
            sec = 0
        }
        if(min >= 60) {
            min = 0;
        }
        if(hr > 1) {
            return `${m2(hr)}:${m2(min)}:${m2(sec)}`;
        }
        return `${m2(min)}:${m2(sec)}`;
    }

    // 7secs, 10secs
    client.createBar = (duration, position) => {
        try {
            const full = "▰";
            const empty = "▱"
            const size = "▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱".length;
            const percent = duration == 0 ? null : Math.floor(position / duration * 100)
            const fullBars = Math.round(size * (percent / 100));
            const emptyBars = size - fullBars;
            return `**${full.repeat(fullBars)}${empty.repeat(emptyBars)}**`
        } catch (e) {
            console.error(e)
        }
    }

    client.getYTLink = (ID) => {
        return `https://www.youtube.com/watch?v=${ID}`;
    }

    client.joinVoiceChannel = async (channel) => {
        return new Promise(async (res, rej) => {
            const oldConnection = getVoiceConnection(channel.guild.id);
            if (oldConnection) return rej(`I am already connected in: <#${oldConnection.joinConfig.channelId}>`);
            //this creates the new connection
            const newConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
            await delay(250);
            newConnection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                try {
                    //this will check if it is either connecting or signalling for 5 seconds.
                    await Promise.race([
                        entersState(newConnection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(newConnection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                } catch (error) {
                    newConnection.destroy(); // Left the voice channel.
                }
            })

            newConnection.on(VoiceConnectionStatus.Destroyed, () => {
                //delet queue
                client.queues.delete(channel.guild.id);
            })

            return res("Connected to voice channel")
        })
    }

    client.leaveVoiceChannel = async (channel) => {
        return new Promise(async (res, rej) => {
            const oldConnection = getVoiceConnection(channel.guild.id);
            if(oldConnection) {
                if(oldConnection.joinConfig.channelId !== channel.id) {
                    return rej("We aren't in the same channel!");
                }
                try {
                    oldConnection.destroy();
                    await delay(250);
                    return res(true);
                } catch (error) {
                    return rej(error);
                }
            } else {
                return rej("I'm not connected somewhere!")
            }
        })
    }

    function delay(ms) {
        return new Promise((res) => setTimeout(() => res(2), ms));
    }
}
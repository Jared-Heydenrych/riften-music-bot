//this is the discord builder.
const { SlashCommandBuilder } = require("@discordjs/builders")
//this is the message embed object.
const { MessageEmbed, Message } = require("discord.js")
// this is the Query Type Object
const { QueryType } = require("discord-player")

//allow to export all our data.
module.exports = {
    //this will include our slash command data
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays songs loaded from source")
        .addSubcommand((subcommand) =>
            subcommand
            .setNames("song")
            .setDescription("Loads a single song from URL")
            .addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("playlist")
                .setDescription("loads a playlist of songs from a url")
                .addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("search")
                .setDescription("Search's songs based on provided keywords.")
                .addStringOption((option) => option.setName("searchterms").setDescription("the serached keywords").setRequired(true))
        ),

        run: async ({ client, interaction }) => {
            //checks if the user is not in a voice channel
            if (!interaction.member.voice.channel)
                return interaction.editReply("You need to be in a VC to use this command")
            
            //this will create the queue
            const queue = await client.players.createQueue(interaction.guild)
            //if there is no queue connection, then we will have the connect to the voice channel
            //that the member is currently in
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)

            //this will create an embed object.
            let embed = new MessageEmbed()

            if(interaction.options.getSubcommand() === "song") {
                //gets url from the string.
                let url = interaction.options.getString("url")
                //this will attempt to search for the song on youtube
                //this will return the result as an arry of 'tracks'
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })

                //if the tracks is at the lenght of 0, it means it returned nothing.
                if (result.tracks.length === 0) {
                    return interaction.editReply("No results")
                }

                //otherwise, it will add the first song of the tack to the queue.
                const song = result.tracks[0]
                await queue.addTrack(song)
                //this will give the user some information on what we added.
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})

            } else if(interaction.options.getSubcommand() === "playlist") {
                //gets url from the string.
                let url = interaction.options.getString("url")
                //this will attempt to search for the playlist on youtube
                //this will return the result as an arry of 'tracks'
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })

                //if the tracks is at the lenght of 0, it means it returned nothing.
                if (result.tracks.length === 0) {
                    return interaction.editReply("No results")
                }

                //otherwise, it will add the playlist to the queue.
                const playlist = result.playlist
                await queue.addTracks(result.tracks)
                //this will give the user some information on what we added.
                embed
                    .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** hava been added to the Queue`)
                    .setThumbnail(playlist.thumbnail)

            } else if(interaction.options.getSubcommand() === "search") {
                //gets searchterms from the string.
                let url = interaction.options.getString("searchterms")
                //this will YOUTUBE_VIDEOattempt to search for the song on youtube
                //this will return the result as an arry of 'tracks'
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO //This will look from any type of audio outlet, like Spotify or Soundcloud.
                })

                //if the tracks is at the lenght of 0, it means it returned nothing.
                if (result.tracks.length === 0) {
                    return interaction.editReply("No results")
                }

                //otherwise, it will add the first song of the tack to the queue.
                const song = result.tracks[0]
                await queue.addTrack(song)
                //this will give the user some information on what we added.
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
            }

            //if the song is not playing, it will then play.
            if (!queue.playing) await queue.play()
            await interaction.editReply({
                embeds: [embed]
            })
        }
}

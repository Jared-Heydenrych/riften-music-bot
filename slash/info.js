//this is the discord builder.
const { SlashCommandBuilder } = require("@discordjs/builders")
//this is the message embed object.
const { MessageEmbed, Message } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays info of the current track playing."),

    run: async ({client, interaction}) => {

        //grabe the queue object
        const queue =  client.player.getQueue(interaction.guildId)

        //if there is no queue, then reply with following message
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue")
        }

        //this will create a progress bar for the current track in a string form.
        let bar = queue.createProgressBar({
            //we want a singualr song, not the entire queue.
            queue: false,
            //number of characters to be capped at 19.
            length: 19
        })

        const song = queue.current

        //will return an embed message.
        await interaction.editReply({
            embeds: [new MessageEmbed()
            .setThumbnail(song.thumbnail)
            .setDescription(`Currently playing [${song.title}](${song.url})\n\n` + bar)
        ],
        })
    }
}
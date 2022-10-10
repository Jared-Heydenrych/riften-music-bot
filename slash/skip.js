//this is the discord builder.
const { SlashCommandBuilder } = require("@discordjs/builders")
//this is the message embed object.
const { MessageEmbed, Message } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current track"),

    run: async ({client, interaction}) => {

        //grabe the queue object
        const queue =  client.player.getQueue(interaction.guildId)

        //if there is no queue, then reply with following message
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue")
        }

        //this grabs the current song to be skipped.
        const song =  queue.current

        //this will skip the current song.
        queue.skip()

        //will return an embed message.
        await interaction.editReply({
            embeds: [new MessageEmbed()
            .setDescription(`${song.title} has been skipped!`)
            .setThumbnail(song.thumbnail)
        ],
        })
    },
}
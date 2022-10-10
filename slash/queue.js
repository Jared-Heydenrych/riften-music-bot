//this is the discord builder.
const { SlashCommandBuilder } = require("@discordjs/builders")
//this is the message embed object.
const { MessageEmbed, Message } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue")
    .addNumberOption((option) => option.setName("page").setDescription("Page Number of the queue").setMinValue(1)),

    run: async ({ client, interaction }) => {
        //gets queue of the current guild/server. (the queue object)
        const queue = client.player.getQueue(interaction.guildId)

        //this will check if there is no queue or no playing queue.
        if (!queue || !queue.playing) {
            return await interaction.editReply("There are no songs in the queue")
        }

        //else we continue by checking the total pages there are
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages) {
            return await interaction.editReply(`Invalid page. There are only a total of ${totalPages} pages of songs`)
        }

        //this will construct the queue as a string
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        //tis will get the current song.
        const currentSong = queue.current

        //reply with the embed
        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Currently Playing**\n` +
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}
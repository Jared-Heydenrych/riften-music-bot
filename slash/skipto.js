//this is the discord builder.
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip_to")
        .setDescription("Skips to a certain track number #")
        .addNumberOption((option) => 
            option.setName("tracknumber")
                .setDescription("Track number to skip to")
                .setMinValue(1)
                .setRequired(true)),

    run: async ({client, interaction}) => {

        //grabe the queue object
        const queue =  client.player.getQueue(interaction.guildId)

        //if there is no queue, then reply with following message
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue")
        }
        //this grabs the track number of the song.
        const trackNum = interaction.options.getNumber("tracknumber")

        //this will check if the track number is actually valid.
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("Invalid track number")

        //this will skip to the track number given.
        queue.skipTo(trackNum - 1)
        await interaction.editReply(`Skipped ahead to track number ${trackNum}`)
    },
}
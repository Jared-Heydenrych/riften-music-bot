//this is the discord builder.
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the music"),

    run: async ({client, interaction}) => {

        //grabe the queue object
        const queue =  client.player.getQueue(interaction.guildId)

        //if there is no queue, then reply with following message
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue")
        }

        //this will resume the currently playing song and respond with following message.
        queue.setPaused(false)
        await interaction.editReply("Music has been resumed! Use `/pause` to pause music.")
    },
}
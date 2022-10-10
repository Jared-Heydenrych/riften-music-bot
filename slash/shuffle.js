//this is the discord builder.
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shufle")
        .setDescription("Shuffles the queue"),

    run: async ({client, interaction}) => {

        //grabe the queue object
        const queue =  client.player.getQueue(interaction.guildId)

        //if there is no queue, then reply with following message
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue")
        }

        //this will destroy the queue, and will simaltaniously remove the bot from the voice channel.
        queue.shuffle()
        await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled!`)
    }
}
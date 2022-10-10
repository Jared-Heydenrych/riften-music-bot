//this is the discord builder.
const { SlashCommandBuilder } = require("@discordjs/builders")
//this is the message embed object.
const { MessageEmbed, Message } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Stops the bot and clears the queue"),

    run: async ({client, interaction}) => {

        //grabe the queue object
        const queue =  client.player.getQueue(interaction.guildId)

        //if there is no queue, then reply with following message
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue")
        }

        //this will destroy the queue, and will simaltaniously remove the bot from the voice channel.
        queue.destroy()
        await interaction.editReply("Bye!")
    }
}
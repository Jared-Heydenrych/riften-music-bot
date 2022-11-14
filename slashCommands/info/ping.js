module.exports = {
    name: "ping",
    description: "Shows the bots ping",
    run: async (client, interaction, args, prefix) => {
        interaction.editReply({
            ephemeral: true,
            content: `:ping_pong: **My ping is \`${client.ws.ping}ms\`!**`
        }).catch(() => null);
        return;
    }
}
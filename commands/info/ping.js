module.exports = {
    name: "ping",
    description: "Shows the bots ping",
    aliases: ["latency"],
    run: async (client, message, args, prefix) => {
        message.repy({
            content: `:ping_pong: **My ping is \`${client.ws.ping}ms\`!**`
        }).catch(() => null);
        return;
    }
}
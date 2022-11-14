module.exports = client => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity(`${client.config.prefix}help | /help | Riften Music`, {type: "PLAYING"});
    setInterval(() => {
        client.user.setActivity(`${client.config.prefix}help | /help | Riften Music`, {type: "PLAYING"});
    }, 600_000)
}
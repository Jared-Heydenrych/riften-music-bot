const { readdirSync } = require("fs");
module.exports = async client => {

    readdirSync(`${process.cwd()}/commands/`)
        .forEach(directory => {
            const commands = readdirSync(`${process.cwd()}/commands/${directory}/`)
                .filter(file => file.endsWith(".js"))
                .forEach(file => {
                    let pull = require(`${process.cwd()}/commands/${directory}/${file}`);
                    client.commands.set(pull.name, pull);
                })
        })

    readdirSync(`${process.cwd()}/events/`).filter(file => file.endsWith(".js"))
        .forEach(file => {
            let pull = require(`${process.cwd()}/events/${file}`);
            let eventName = file.split(".")[0]; //messageCreate.js --> "messageCreate"
            client.on(eventName, pull.bind(null, client));
        })

    const slashCommandsArray = [];
    readdirSync(`${process.cwd()}/slashCommands/`)
        .forEach(directory => {
            const commands = readdirSync(`${process.cwd()}/slashCommands/${directory}/`)
                .filter(file => file.endsWith(".js"))
                .forEach(file => {
                    let pull = require(`${process.cwd()}/slashCommands/${directory}/${file}`);
                    client.slashCommands.set(pull.name, pull);
                    slashCommandsArray.push(pull);
                })
        })
    
    client.on("ready", () => {
        if (client.deploySlash.enabled) {
            if (client.deploySlash.guild) {
                client.guilds.cache.get(client.deploySlash.guild).commands.set(slashCommandsArray);
            } else {
                // global might take up to 1 hr to save.
                client.application.commands.set(slashCommandsArray);
            }
        }
    });

    process.on("unhandledRejection", (reason, p) => {
        console.log("unhandledRejection", reason)
    })
    process.on("uncaughtException", (err, origin) => {
        console.log("uncaughtException", err )
    })
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log("uncaughtExceptionMonitor")
    })
}
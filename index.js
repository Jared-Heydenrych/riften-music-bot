const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

const client = new Client(clientSettingsObject());

client.deploySlash = {
    enabled: true,
    guild: "946438195166457866", //false | "ID" (if it's false, just set global once, and then never needed again!)
}

client.config = require("./config/config.json");
//the collections are maps
client.commands = new Collection();
client.slashCommands = new Collection();
client.queues = new Collection();

require("./util/handler")(client);
require("./util/musicUtils")(client);


client.login(client.config.token);

function clientSettingsObject() {
    return {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates
        ],
        partials: [ "MESSAGE", "CHANNEL", "REACTION" ],
        failIfNotExists: false,
        allowedMentions: {
            parse: [ "roles", "users" ],
            repliedUser: false, 
        },
        shards: "auto"
    }
}
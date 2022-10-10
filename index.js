//for the discord client.
const Discord = require("discord.js")
//used to pull out the token from our bot.
const dotenv = require("dotenv")

//These two are used to set up the slash commands for the bot
//Gets the rest library from discord.js.
const { Rest } = require("@discordjs/rest")
//Get the routes from the discord api
const { Routes } = require("@discord-api-types/v9")
//used to read files
const fs = require("fs");
//Player library to be used for the queue and more difficult aspects for the discord music.
const { Player } = require("discord-player");

//Configure the dotenv token and the process it as a TOKEN value.
dotenv.config()
const TOKEN = process.env.TOKEN

//This will be a bool looking at the command arguments that we set when we run the bot code.
//Typically when we run the bot code, we write Node index.js and this is all stored in the argv array.
//So it will be stored with node and index.js in there.
const LOAD_SLASH = process.argv[2] == "load"

//These two are used to deploy the slash commands
//Client Id for the bot (Application ID)
const CLIENT_ID = "1027900676577165374"
//Guild ID is for where the bot will be executable in (Server ID)
const GUIDL_ID = "946438195166457866"

//initializes the discord client
const client = new Discord.Client({
    intents: [
        //this allows us to see the voice channel states
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
})

//gets slash commands for the Collection function and library.
client.slashcommands = new Discord.Collection()
//creates new player object
client.player = new Player(client, {
    //ytdl is youtube downloader which will handle the streaming of music
    ytdlOptions: {
        //specifies some of the information here
        quality: "highestaudio", //specifies the audio only and choosing the highest quality
        highWaterMark: 1 << 25 // not sure what this does just yet.
    }
})

//now creates a slash command loader for the slash folder
// we will be using this array when we want to deploy the slash commands
let commands = [] // this stores all the commands

//to read all the slash commands in the folder
// this last part will filter and add only the .js files
const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js")) 
//used to loop through all the files in the folder
for (const file of slashFiles) {
    //this will go into the directory and insert the file of that command and actuall
    //pull out the content of that file in the variable called slash command
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    // if we load, this will push/add all the slash commands to the commands array.
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON()) 
}

if (LOAD_SLASH) {
    const rest = new Rest({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    //this generates a url with the guild and client id, this will allow us to deploy all the commands
    //in the body and data to a certain point in the api with the client and guild.
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUIDL_ID), {body: commands})
    //we will then want to see if it succeeded, and then if it does, the commands in the brackets will run.
    .then(() => {
        console.log("Successfully Loaded!");
        process.exit(0);
    })
    //if we catch an error, this will print said error and then stop the bot entirely.
    .catch((err) => {
        if (err) {
            console.log(err);
            process.exit.exit(1);
        }
    })
}
//this is if no commands are loaded.
else{
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        //handles the commands via interaction.
        async function handleCommand() {
            if (!interaction.isCommand()) return

            //this will try to get the slash commands from the discord collection.
            const slashcmd = client.slashcommands.get(interaction.commandName)
            //if it doesn't exist, then reply with following message.
            if (!slashcmd) interaction.reply("Not valid slash command")

            //this makes your bot reply with thinking, thus allowing the bot to wait long for 
            //input of slash command, else discord will think it is too slow and end the slash command.
            await interaction.deferReply()
            //this will run the actuall command.
            await slashcmd.run({client, interaction})
        }
        handleCommand()
    })
    //adds clinetlogin with token and index.js?
    client.login(TOKEN)
}
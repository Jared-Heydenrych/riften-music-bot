module.exports = async (client, interaction) => {
    if(interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if(!cmd) return interaction.reply({content: `❌ **This command is not executable, anymore!**`})

        const args = [];

        for(let option of interaction.options?.data) {
            if(option.type === "SUB_COMMAND") {
                if(option.name) args.push(option.name)
                option.options?.forEach(o => {
                    if(o.value) args.push(o.value)
                })
            } else if(option.value) args.push(option.value)
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id) || await interaction.guild.members.fetch(interaction.user.id).catch(() => null);

        try {
            cmd.run(client, interaction, args, "/");
        } catch (e){
            console.error(e);
            //don't reply
        }


        
    }
}
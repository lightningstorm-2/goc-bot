const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: `eit`
    },
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
        .setTitle(`**ARCELON AGENCY: External Intelligence Team Information**`)
        .setDescription(`*There are always threats to the GOC, whether they come from a single rogue person or a large, intricate group bent on destroying the GOC. By conducting espionage and counterintelligence on suspected hostiles, the EIT is entrusted with identifying and monitoring such threats well in advance of their impact. To keep the GOC ahead of the game, they also gather military intelligence on known threats.*

*"Serve as the overwatch for GOC, constantly watching over the GOC to make sure no one will threaten our beloved home, they ranges from launching counterintelligence against hostile factions or rogue individuals who seek chaos in our homeland, they seek and uncovered the plots for GOC before they could start the first stage."*

**"There is no dishonesty."**

- **Our Requirement from you:**
- **Be trusted in the GOC**
- **Serve for 3 weeks**
- **Mature**
- **Willing to cooperate with fellow EIT members**
**YOU MUST BE BASIC OPERATIVE+ TO JOIN!**
----------------------------------------------------------------------------------`)
        .setColor(0xff0000)
        
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
    }
}
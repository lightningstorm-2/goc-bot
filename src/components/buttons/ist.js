const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: `ist`
    },
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
        .setTitle(`**ARCELON AGENCY: Internal Security Team Information**`)
        .setDescription(`*In 1972, a note was sent to the Coalition's Head, detailing GOC officials' corruption and operative misbehavior, as well as the disappearance of numerous significant GOC assets. The Internal Security Team was established as a direct result of this incident. They were sometimes referred to as the "secret police" of the GOC and were entrusted with investigating and eliminating corrupt officials inside the agency. They are also responsible for protecting and safeguarding resources, such as facilities, supplies, and oddities. Their goal is to maintain the GOC stable both inside and outside the GOC, be the first to react to threats, and serve as the primary combative force for Arcelon Agency, handling everything from combat to investigation.*

*The IST are the main combative force for Arcelon Agency, ranging from combat to investigation, and to keep the GOC stable inside or outside the GOC, always the first to respond to threats and eliminate them without them being noticed by the GOC. We pick the trusted and skilled operator to join the IST.* 

**"For power shall not be held by untruthful men."**

**Our requirement from you:**
- Be mature
- Clear of records within the GOC
- Serve for 2 weeks.
- Willingly to do investigations.

**YOU MUST BE BASIC OPERATIVE+ TO JOIN!**

***"Without them, who's willing to put down the one who has fallen to corruption? And who has the guts to do the deed? Is it the IST that will to do the job"***
----------------------------------------------------------------------------------`)
        .setColor(0xff0000)
        
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
    }
}
const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dep")
    .setDescription(
      "Starts a deployment poll."
    )
    .addStringOption((option) =>
      option
        .setName("site")
        .setDescription("Area of deployment.")
        .setRequired(true)
    ),
    

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const allowedRoles = [
      "1331284913395077170",
      "1213603754595852358",
      "1183473286856847390",
      "1179524589592784996",
    ];
    const member = interaction.member;

    const hasAccess = allowedRoles.some((roleId) =>
      member.roles.cache.has(roleId)
    );
    if (!hasAccess) {
      return interaction.editReply({
        content: "❌ You do not have permission to use this command.",
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const depEmbed = new EmbedBuilder()
      .setTitle("Deployment Session")
      .setColor("#589FFF")
      .setDescription(
        `
      <:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828>\n## The deployment has started. Follow the instructions to join the deploment:\n- Search ${interaction.options.getString("site")} in SCP: Roleplay Custom Server List and join the Site.\n- Join RRT team and say !UNGOC in radio.\n- Send your morph in <#>.\n<:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828>
          ` 
      )
      .setAuthor(
        `
        <t:${timestamp}:f> 
        `
      );


    const targetGuildId = "1142991341811408948";
    const targetChannelId = "1374713476077064222";
    try {
      const targetGuild = interaction.client.guilds.cache.get(targetGuildId);
      if (targetGuild) {
        const channel = targetGuild.channels.cache.get(targetChannelId);
        if (channel && channel.isTextBased()) {

          await channel.send({ embeds: [pollEmbed] });
        } else {
          console.warn("⚠️ Could not find text channel in the target guild.");
        }
      } else {
        console.warn("⚠️ Could not find the target guild.");
      }
    } catch (err) {
      console.error("❌ Failed to send message in other guild:", err);
    }

    await interaction.editReply({
      content: `✅ Successfully initiated a deployment session at <t:${timestamp}:R>.`,
      ephemeral: true,
    });
  },
};

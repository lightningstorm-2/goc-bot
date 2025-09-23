const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dep")
    .setDescription("Starts a deployment poll.")
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
      "1215866479514484786",
      "989415856347971636",
      "1391916683865624577",
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

    const timestamp = Date.now()

    const ping = `<@&989415158549995540>`

    const depEmbed = new EmbedBuilder()
      .setTitle("Deployment Session")
      .setColor("#589FFF")
      .setDescription(
        `
      <:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828>\n## A deployment has started on ${interaction.options.getString("site")}.\n### Follow the instructions to join the deploment:\n- Search ${interaction.options.getString(
        "site"
      )} in SCP: Roleplay Custom Server List and join the server.\n- Join any foundation team and say !GLOBAL in radio.\n- Send your morph in <#1355573068499779644>.\n<:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828>
          `
      )
      .setTimestamp(timestamp);

    const targetGuildId = "944748036419108875";
    const targetChannelId = "989416631170138142";
    try {
      const targetGuild = interaction.client.guilds.cache.get(targetGuildId);
      if (targetGuild) {
        const channel = targetGuild.channels.cache.get(targetChannelId);
        if (channel && channel.isTextBased()) {
          await channel.send({content: ping, embeds: [depEmbed] });
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

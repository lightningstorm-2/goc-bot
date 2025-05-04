const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recruit")
    .setDescription(
      "Recruit a new member by assigning roles and sending onboarding info."
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to recruit")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const allowedRoles = ["1331284913395077170", "1213603754595852358", "1183473286856847390", "1179524589592784996"];
    const member = interaction.member;

    const hasAccess = allowedRoles.some((roleId) =>
      member.roles.cache.has(roleId)
    );
    if (!hasAccess) {
      return interaction.editReply({
        content: "❌ You do not have permission to use this command.",
      });
    }

    const target = interaction.options.getMember("user");
    if (!target) {
      return interaction.editReply({
        content: "⚠️ Couldn't find the user in this server.",
      });
    }

    const rolesToAdd = [
      "989415158549995540",
      "989415204133683200",
      "1183471903172743198",
    ];
    const roleToRemove = "989415105093591080";

    try {
      await target.roles.add(rolesToAdd);
      await target.roles.remove(roleToRemove);
    } catch (err) {
      console.error("❌ Role modification error:", err);
      return interaction.editReply({
        content: "⚠️ Failed to modify roles for the target user.",
      });
    }

    const dmEmbed = new EmbedBuilder()
      .setTitle("Welcome to Global Occult Coalition!")
      .setColor("Blue")
      .setDescription(
        `
      Please refer to the following:
      [Join our Roblox Group](https://www.roblox.com/groups/13967152/GOC-Global-Occult-Coalition-GOC#!/s)
      <#1127153205734809720> — Important handbooks, please read.
      <#1147571213649059983> — Request your codename (follow the format).
      <#1144476467967823903> — Morph templates and regulations.
      <#1127391861758234636> — Store morphs for deployments/events.
      <#1216231256304390195> — Request rank in the Roblox group.
      <#1110780853027602482> — Log self-deployments (follow the format).
      <#1129986180432281641> — Request promotion after enough points.
      <#1130010738338037790> — Ask questions here, staff will assist.
      
      If you have any other concerns, feel free to DM a Command Staff member.
      Have a good day!
          `
      )
      .setFooter({
        text: "Global Occult Coalition",
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    try {
      await target.send({ embeds: [dmEmbed] });
    } catch {
      await interaction.editReply({
        content: "⚠️ Couldn't send a DM to the user.",
      });
      return;
    }

    await interaction.editReply({
      content: `✅ Successfully recruited ${target.user.tag}.`,
    });
  },
};

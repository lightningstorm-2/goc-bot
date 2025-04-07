const { EmbedBuilder } = require("discord.js");
const Application = require("../../schemas/application");

const MAIN_GUILD_ID = "944748036419108875";
const APPLICATION_ROLE = "1356706851281965136";
const PASSED_ROLE = "989415204133683200";

module.exports = {
  data: {
    name: "accept_app",
  },
  async execute(interaction, client) {
    const userId = interaction.customId.split("_")[2];
    const mainGuild = await client.guilds.fetch(MAIN_GUILD_ID);
    const member = await mainGuild.members.fetch(userId).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "⚠️ Could not find the user in the main server.",
        ephemeral: true,
      });
    }

    try {
      await member.roles.remove(APPLICATION_ROLE);
      await member.roles.add(PASSED_ROLE);

      // Defer update first
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferUpdate();
      }

      // Edit the message after deferring
      await interaction.editReply({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]).setColor("Green").setFooter({
            text: `✅ Accepted by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          }),
        ],
        components: [],
      });

      await Application.findOneAndDelete({ userId });

      await member.send("🎉 Your application has been accepted. Welcome aboard!").catch(() => null);
    } catch (err) {
      console.error("❌ Error accepting application:", err);
      if (!interaction.replied) {
        await interaction.reply({
          content: "⚠️ Something went wrong while accepting the application.",
          ephemeral: true,
        }).catch(() => {});
      }
    }
  },
};

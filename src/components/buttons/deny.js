const { EmbedBuilder } = require("discord.js");
const Application = require("../../schemas/application");

const APPLICATION_ROLE = "1356706851281965136";

module.exports = {
  data: {
    name: "deny_app",
  },
  async execute(interaction, client) {
    const userId = interaction.customId.split("_")[2];

    try {
      // Defer interaction before editing
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferUpdate();
      }

      // Edit the message with denied embed
      await interaction.editReply({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0])
            .setColor("Red")
            .setFooter({
              text: `❌ Denied by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            }),
        ],
        components: [],
      });

      await Application.findOneAndDelete({ userId });

      // Try to DM the user
      const user = await client.users.fetch(userId).catch(() => null);
      if (user) {
        await user.send("❌ Your application has been denied.").catch(() => {});
      }
    } catch (err) {
      console.error("❌ Error denying application:", err);
      if (!interaction.replied) {
        await interaction.reply({
          content: "⚠️ Something went wrong while denying the application.",
          ephemeral: true,
        }).catch(() => {});
      }
    }
  },
};

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const StatusMessage = require("../../../schemas/statusMessage");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Restarts the bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  async execute(interaction, client) {
    const allowedRoleId = "1351470675013013574";
    const member = interaction.member;

    // Check role OR admin permission
    const hasAccess =
      member.roles.cache.has(allowedRoleId) ||
      member.permissions.has(PermissionFlagsBits.Administrator);

    if (!hasAccess) {
      return interaction.reply({
        content: "❌ You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: "Simulating bot shutdown...",
      ephemeral: true,
    });

    try {
      const status = await StatusMessage.findById("statusDoc");
      if (!status) return process.exit(0);

      const channel = await client.channels.fetch(status.channelId);

      // Delete last online message
      if (status.onlineMessageId) {
        try {
          const msg = await channel.messages.fetch(status.onlineMessageId);
          await msg.delete();
          console.log("🗑️ Deleted online message before shutdown.");
        } catch (err) {
          console.warn("⚠️ Failed to delete online message:", err.message);
        }
      }

      // Send shutdown message
      const shutdownMsg = await channel.send("🔻 Bot is shutting down...");

      await StatusMessage.findByIdAndUpdate("statusDoc", {
        shutdownMessageId: shutdownMsg.id,
        onlineMessageId: null,
      });

      console.log("📨 Sent shutdown message.");
      process.exit(0);
    } catch (err) {
      console.error("❌ Error during shutdown-test:", err);
      process.exit(1);
    }
  },
};

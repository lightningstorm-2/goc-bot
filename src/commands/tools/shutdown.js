const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const StatusMessage = require("../../schemas/statusMessage");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Forces the bot to shutdown and restart on Railway.")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  
  async execute(interaction, client) {
    const allowedRoleId = "1351470675013013574";
    const member = interaction.member;

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
      content: "🔻 Deleting last online message and restarting...",
      ephemeral: true,
    });

    try {
      const status = await StatusMessage.findById("statusDoc");

      if (status?.onlineMessageId) {
        try {
          const channel = await client.channels.fetch(status.channelId);
          const msg = await channel.messages.fetch(status.onlineMessageId).catch(() => null);
          if (msg) {
            await msg.delete();
            console.log("🗑️ Deleted previous online message.");
          }
        } catch (err) {
          console.warn("⚠️ Could not delete online message:", err.message);
        }
      }

      // Clear it from DB
      await StatusMessage.findByIdAndUpdate("statusDoc", {
        onlineMessageId: null,
      });

      console.log("❗ Crashing intentionally to trigger Railway restart...");
      throw new Error("Intentional crash for Railway auto-restart");

    } catch (err) {
      console.error("⚠️ Shutdown command error:", err);
      throw new Error("Forced Railway restart via shutdown command");
    }
  },
};
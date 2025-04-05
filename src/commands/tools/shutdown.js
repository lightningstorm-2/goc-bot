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

    // Check if user has the allowed role or admin perms
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
      content: "🔻 Simulating bot shutdown and restart...",
      ephemeral: true,
    });

    try {
      const status = await StatusMessage.findById("statusDoc");
      if (status && status.onlineMessageId) {
        const channel = await client.channels.fetch(status.channelId);
        const msg = await channel.messages.fetch(status.onlineMessageId).catch(() => null);
        if (msg) await msg.delete().catch(() => {});
      }

      const channel = await client.channels.fetch(status.channelId);
      const shutdownMsg = await channel.send("🔻 Bot is shutting down...");

      await StatusMessage.findByIdAndUpdate("statusDoc", {
        shutdownMessageId: shutdownMsg.id,
        onlineMessageId: null,
      });

      console.log("📨 Sent shutdown message.");
      console.log("❗ Crashing intentionally to trigger Railway restart...");

      // ❌ Crash on purpose to force Railway restart
      throw new Error("Intentional crash for Railway auto-restart");

    } catch (err) {
      console.error("⚠️ Shutdown-test error:", err);
      // Still crash intentionally if inside catch
      throw new Error("Forced Railway restart from shutdown-test");
    }
  },
};

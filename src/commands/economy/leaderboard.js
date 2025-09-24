const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("points_leaderboard")
    .setDescription("Show the top 10 users with the highest points in this server"),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const guildId = interaction.guild.id;

      const topBalances = await Balance.find({ guildId })
        .sort({ balance: -1 })
        .limit(10);

      if (!topBalances.length) {
        return interaction.editReply("❌ No points data found for this server.");
      }

      const leaderboard = topBalances
        .map((entry, index) => `**${index + 1}.** <@${entry.userId}> — ${entry.balance} points`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle("🏆 Leaderboard")
        .setDescription(leaderboard)
        .setColor("Gold");

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("❌ Error generating leaderboard:", error);
      await interaction.editReply("⚠️ Something went wrong while generating the leaderboard.");
    }
  },
};

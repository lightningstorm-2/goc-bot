const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("points_increase")
    .setDescription("Increases specified points to the mentioned person.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you'd like to increase points of.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of points to increase.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    // 🔒 Role ID required to use this command
    const requiredRoleId = "1349692317174599702"; 

    // Check if the user has the required role
    if (!interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply({
        content: "❌ You do not have permission to use this command!",
        ephemeral: true,
      });
    }

    // Proceed if the user has the role
    let amount = interaction.options.getInteger("amount");
    const selectedUser = interaction.options.getUser("target");

    // Fetch balance
    const selectedUserBalance = await client.fetchBalance(
      selectedUser.id,
      interaction.guild.id
    );

    // Ensure balance exists before proceeding
    if (!selectedUserBalance) {
      return interaction.reply({
        content: `Error: Could not fetch balance for ${selectedUser.username}.`,
        ephemeral: true,
      });
    }

    // Update balance
    await Balance.findOneAndUpdate(
      { _id: selectedUserBalance._id },
      {
        balance: Number(selectedUserBalance.balance) + Number(amount),
      }
    );

    const targetGuildId = "944748036419108875";
    const targetChannelId = "1420026487129636945";
    try {
      const targetGuild = interaction.client.guilds.cache.get(targetGuildId);
      if (targetGuild) {
        const channel = targetGuild.channels.cache.get(targetChannelId);
        if (channel && channel.isTextBased()) {
          const timestamp = Date.now()

          const pointsEmbed = new EmbedBuilder()
            .setTitle("Points Increase Log")
            .setDescription(`Points of <@${selectedUser.id}> has been increased by ${Number(amount)}.\nPoints increased by <@${interaction.member.id}>.\nNew points: ${Number(selectedUserBalance.balance) + Number(amount)}`)
            .setColor("#1FF200")
            .setTimestamp(timestamp);

          await channel.send({ embeds: [pointsEmbed] });
        } else {
          console.warn("⚠️ Could not find text channel in the this guild.");
        }
      } else {
        console.warn("⚠️ Could not find the guild.");
      }
    } catch (err) {
      console.error("❌ Failed to send message in the guild:", err);
    }
    
    // Reply to user
    await interaction.reply({
      content: `You've added ${amount} points to ${selectedUser.username}.\nNew points: ${Number(selectedUserBalance.balance) + Number(amount)}`,
      ephemeral: false,
    });
  },
};

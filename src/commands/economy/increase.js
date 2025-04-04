const { SlashCommandBuilder } = require("discord.js");
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
    let amount = interaction.options.getNumber("amount");
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

    // Format amount to 2 decimal places
    amount = Number(amount).toFixed(2);

    // Update balance
    await Balance.findOneAndUpdate(
      { _id: selectedUserBalance._id },
      {
        balance: Number(selectedUserBalance.balance) + Number(amount),
      }
    );

    // Reply to user
    await interaction.reply({
      content: `You've added ${amount} points to ${selectedUser.username}.\nNew points: ${Number(selectedUserBalance.balance) + Number(amount)}`,
      ephemeral: false,
    });
  },
};

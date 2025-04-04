const { SlashCommandBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("points_set")
    .setDescription("Sets the user's points.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you'd like to set points of.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of points to set.")
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
        balance: Number(amount),
      }
    );

    // Reply to user
    await interaction.reply({
      content: `You've set ${selectedUser.username}'s points to ${amount}.`,
      ephemeral: false,
    });
  },
};

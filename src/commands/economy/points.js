const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Returns the points of a user mentioned.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you'd like to view the points of.")
    ),
  async execute(interaction, client) {
    const selectedUser =
      interaction.options.getUser("target") || interaction.user;
    const storedBalance = await client.getBalance(
      selectedUser.id,
      interaction.guild.id
    );

    if (!storedBalance)
      return await interaction.reply({
        content: `${selectedUser.username} doesn't have any points.`,
        ephemeral: false,
      });
    else {
      await interaction.reply({
        content: `${selectedUser.username} has ${storedBalance.balance} points.`,
        ephemeral: false,
      });
    }
  },
};

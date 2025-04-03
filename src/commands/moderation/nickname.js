const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Sets or changes the nickname for the member provided.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to change nickname of.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("The new nickname of the provided member.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription(
          "The reason for change the nickname of the member provided."
        )
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason");
    const name = interaction.options.getString("nickname");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

    if (!reason) reason = "No reason is provided.";

    const embed = new EmbedBuilder()
      .setTitle(
        `${user.tag}\' nickname has been changed to ${name}\nReason: ${reason}`
      )
      .setColor(0xff0000)
      .setTimestamp(Date.now());

    await member.setNickname(name, reason);

    await interaction
      .reply({
        embeds: [embed],
      })
      .catch(console.error);
  },
};

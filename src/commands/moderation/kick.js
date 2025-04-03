const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks the member provided.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for kicking the member provided.")
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

    if (!reason) reason = "No reason is provided.";

    const userEmbed = new EmbedBuilder()
      .setTitle(
        `You have been kicked from ${interaction.guild.name}\nReason: ${reason}`
      )
      .setColor(0xff0000)
      .setTimestamp(Date.now());

    const serverEmbed = new EmbedBuilder()
      .setTitle(`${user.tag} has been kicked from the server.`)
      .setColor(0xff0000)
      .setTimestamp(Date.now());

    await user
      .send({
        embeds: [userEmbed],
      })
      .catch(console.log(`${user.tag}\'DM\' are off.`));

    await member.kick(reason).catch(console.error);

    await interaction
      .reply({
        embeds: [serverEmbed],
      })
      .catch(console.error);
  },
};

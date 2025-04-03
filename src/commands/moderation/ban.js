const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans the member provided.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for banning the member provided.")
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
        `You have been banned from ${interaction.guild.name}\nReason: ${reason}`
      )
      .setColor(0xff0000)
      .setTimestamp(Date.now());

    const serverEmbed = new EmbedBuilder()
      .setTitle(`${user.tag} has been banned from the server.`)
      .setColor(0xff0000)
      .setTimestamp(Date.now());

    await user
      .send({
        embeds: [userEmbed],
      })
      .catch(console.log(`${user.tag}\'DM\' are off.`));

    await member
      .ban({
        deleteMessageDays: 1,
        reason: reason,
      })
      .catch(console.error);

    await interaction
      .reply({
        embeds: [serverEmbed],
      })
      .catch(console.error);
  },
};

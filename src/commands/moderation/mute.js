const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutes the member provided for the duration provided..")
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to mute.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription(
          "The amount of minutes you wish to mute the member provided for."
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for muting the member provided.")
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason");
    const time = interaction.options.getInteger("duration");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

    if (!reason) reason = "No reason is provided.";

    const userEmbed = new EmbedBuilder()
      .setTitle(
        `You have been muted from ${interaction.guild.name} for ${time} minutes.\nReason: ${reason}`
      )
      .setColor(0xff0000)
      .setTimestamp(Date.now())
      .setFooter({
        text: `Bot created by @lightningstormyt.`,
      });

    const serverEmbed = new EmbedBuilder()
      .setTitle(`${user.tag} has been muted for ${time} minutes.`)
      .setColor(0xff0000)
      .setTimestamp(Date.now());

    await user
      .send({
        embeds: [userEmbed],
      })
      .catch(console.log(`${user.tag}\'DM\' are off.`));

    await member.timeout(time * 60 * 1000, reason).catch(console.error);

    await interaction
      .reply({
        embeds: [serverEmbed],
      })
      .catch(console.error);
  },
};

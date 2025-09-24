const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Poll = require("../../schemas/poll");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("co-host")
    .setDescription("Sets the co-host for the latest deployment poll.")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Select the co-host")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    const poll = await Poll.findOne().sort({ createdAt: -1 });
    if (!poll) {
      return interaction.reply({
        content: "❌ No active poll found (it may have expired).",
        ephemeral: true,
      });
    }

    const channel = interaction.client.channels.cache.get(poll.channelId);
    if (!channel?.isTextBased()) {
      return interaction.reply({
        content: "❌ Could not find the poll's channel.",
        ephemeral: true,
      });
    }

    try {
      const message = await channel.messages.fetch(poll.messageId);
      if (!message.embeds[0]) {
        return interaction.reply({
          content: "❌ Poll message does not contain an embed.",
          ephemeral: true,
        });
      }

      const oldEmbed = message.embeds[0];

      const newDescription = oldEmbed.description.replace(
        /### Co-Host: .*/,
        `### Co-Host: <@${user.id}>`
      );

      const updatedEmbed = EmbedBuilder.from(oldEmbed).setDescription(newDescription);

      await message.edit({
        content: message.content,
        embeds: [updatedEmbed],
      });

      await interaction.reply({
        content: `✅ Added <@${user.id}> as co-host.`,
        ephemeral: true,
      });
    } catch (err) {
      console.error("Error updating co-host:", err);
      return interaction.reply({
        content: "❌ Could not edit the poll message.",
        ephemeral: true,
      });
    }
  },
};
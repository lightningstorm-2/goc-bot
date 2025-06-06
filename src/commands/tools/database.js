const Guild = require("../../schemas/guild");
const { SlashCommandBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("database")
    .setDescription("Returns information from a database."),
  async execute(interaction, client) {
    let guildProfile = await Guild.findOne({ guildId: interaction.guild.Id });
    if (!guildProfile) {
      guildProfile = await new Guild({
        _id: new mongoose.Types.ObjectId(),
        guildId: interaction.guild.id,
        guildName: interaction.guild.name,
        guildIcon: interaction.guild.iconURL()
          ? interaction.guild.iconURL()
          : "None.",
      });

      await guildProfile.save().catch(console.error);
      await interaction.reply({
        content: `Server Name: ${guildProfile.guildName}`
      });
      console.log(guildProfile);
    } else {
        await interaction.reply({
          content: `Server Id: ${guildProfile.guildId}`
        });
        console.log(guildProfile);
    }
  },
};

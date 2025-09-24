const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Poll = require(`../../schemas/poll`);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dep_poll")
    .setDescription("Starts a deployment poll.")
    .addStringOption((option) =>
      option
        .setName("site")
        .setDescription("Area of deployment.")
        .setRequired(true)  
    )
    .addStringOption((option) =>
      option
        .setName("ends_in")
        .setDescription("Ends in. Example: XX:10")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("co-host")
        .setDescription("Co-Host of the deployment. Leave N/A if none.")
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const allowedRoles = [
      "1331284913395077170",
      "1213603754595852358",
      "1183473286856847390",
      "1179524589592784996",
      "1215866479514484786",
      "989415856347971636",
      "1391916683865624577",
    ];
    
    const member = interaction.member;

    const hasAccess = allowedRoles.some((roleId) =>
      member.roles.cache.has(roleId)
    );
    if (!hasAccess) {
      return interaction.editReply({
        content: "❌ You do not have permission to use this command.",
      });
    }

    const previousPoll = await Poll.findOne().sort({ createdAt: -1 });
    if (previousPoll) {
      try {
        const prevMessage = await channel.messages.fetch(previousPoll.messageId);
        await prevMessage.delete();
      } catch (err) {
        console.warn("Could not delete previous poll message (maybe already deleted).");
      }
      await Poll.deleteMany({});
    }


const coMember = interaction.options.getMember("co-host"); // might be null
const co = coMember ? `<@${coMember.id}>` : "N/A";

    const timestamp = Date.now()

    const ping = `<@&989415158549995540>`
    
    const pollEmbed = new EmbedBuilder()
      .setTitle("Deployment Poll")
      .setColor("#589FFF")
      .setDescription(
        `
      <:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828>\n### Host: <@${
        interaction.user.id
      }>\n### Co-Host: ${co}\n**Location - ${interaction.options.getString(
          "site"
        )}**\n*4+ Reactions*\n*2+ Points*\n<:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828>
          `
      )
      .setFooter({text: `Ends in ${interaction.options.getString("ends_in")}`})
      .setTimestamp(timestamp);

    const targetGuildId = "944748036419108875";
    const targetChannelId = "989416631170138142";
    let message;
    let channel;
    try {
      const targetGuild = interaction.client.guilds.cache.get(targetGuildId);
      if (targetGuild) {
        channel = targetGuild.channels.cache.get(targetChannelId);
        if (channel && channel.isTextBased()) {
          message = await channel.send({content: ping, embeds: [pollEmbed] });
        } else {
          console.warn("⚠️ Could not find text channel in the target guild.");
        }
      } else {
        console.warn("⚠️ Could not find the target guild.");
      }
    } catch (err) {
      console.error("❌ Failed to send message in other guild:", err);
    }

    await Poll.create({
      messageId: message.id,
      channelId: message.channel.id,
      guildId: channel.guild.id,
    });
    await interaction.editReply({
      content: `✅ Successfully initiated a deployment poll.`,
      ephemeral: true,
    });
  },
};

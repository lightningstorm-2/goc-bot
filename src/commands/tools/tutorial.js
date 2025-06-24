const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tutorial")
    .setDescription(
      "DMs the specified user a tutorial video for Trial Operative."
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to DM")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const allowedRoles = [
      "1331284913395077170",
      "1183473286856847390",
      "1213603754595852358",
      "1238919314564841592",
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

    const target = interaction.options.getMember("user");
    if (!target) {
      return interaction.editReply({
        content: "⚠️ Couldn't find the user in this server.",
      });
    }


    const dmEmbed = new EmbedBuilder()
      .setTitle("<:goc:1121647416639242310> | ɪɴᴛʀᴏᴅᴜᴄᴛɪᴏɴ")
      .setColor("#589FFF")
      .setDescription(
        `
      <:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828><:WGOC:1359126547960823899><:BGOC1:1359126543971913828>
          `
      )
      .setFields(
        {
          name: "𝚁𝚎𝚚𝚞𝚒𝚛𝚎𝚖𝚎𝚗𝚝𝚜",
          value:
            "- As a Trial Operative, you will have limited access to certain events and features until you complete the requirements to become a **Basic Operative.**\n- Attend **[2/2]** deployments under supervision and pass the Aptitude Test to be promoted and begin your journey in the **Global Occult Coalition.**",
        },
        {
          name: "𝚁𝚎𝚜𝚘𝚞𝚛𝚌𝚎𝚜",
          value:
            "The following channels will guide you through your setup:\n- [**Documentation 📖**](https://discord.com/channels/944748036419108875/1127153205734809720) to read through our handbooks for further information.\n- **[Codename Request](https://discord.com/channels/944748036419108875/1147571213649059983)** to request your codename. Follow the format and choose a serious one.\n- **[Trial Morph](https://discord.com/channels/944748036419108875/1371046421788233818)** contains the morph template and lockers. Officers will guide you if it needs fixing.\n- **[Deployments](https://discord.com/channels/944748036419108875/989416631170138142)**, **[Trainings](https://discord.com/channels/944748036419108875/1315412870518935583)** and **[Gamenights](https://discord.com/channels/944748036419108875/989419936063565887)** for you to attend.\n- **[Tryouts](https://discord.com/channels/944748036419108875/1193660145130020864)** if you wish to try your luck in joining one of our available divisions.",
        },
        {
          name: "𝚂𝚒𝚝𝚎𝚜",
          value:
            "We are currently operational on four sites:\n- **Site-45**\n- **Site-64**\n- **Site-73**\n- **Site-56**\nUnderstand their regulations are very different from each other. It's recommended to get yourself familiarized with their own handbooks.",
        },
        {
          name: "𝚆𝚑𝚊𝚝 𝚗𝚘𝚠?",
          value:
            "As soon as you get your codename and morph approved, you're free to attend events and climb your way to Basic Operative. Just remember that you cannot self-deploy until you make your way to Basic Operative.\n\n- *If you have any questions, feel free to ask Command Staff. Good luck!*",
        }
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Join our Roblox Group")
        .setStyle(ButtonStyle.Link)
        .setURL(
          "https://www.roblox.com/communities/13967152/GOC-Global-Occult-Coalition-GOC#!/about"
        )
        .setEmoji("<:RobloxLogo:1374665973851750441>"),
      new ButtonBuilder()
        .setLabel("Join our Alliance Hub (Council of 108)")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/EhXWCmuWsY")
        .setEmoji("<:C108:1373940048881254502>"),
      new ButtonBuilder()
        .setLabel("Join our Foreign Embassy | Appeals Server")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/HnktGuvB2d")
        .setEmoji("<:PSYCHE:1295921161925820516>")
    );

    try {
      await target.send({
        content: `https://cdn.discordapp.com/attachments/1217145904210116770/1387028480503578675/Untitled_video_-_Made_with_Clipchamp_6.mp4?ex=685bda6f&is=685a88ef&hm=aa5240eee7b0a398a3e3e4d8103d52273b9424e0179ac35e6c47e37994e77d5e&`
      });
    } catch {
      await interaction.editReply({
        content: "⚠️ Couldn't send a DM to the user.",
      });
      return;
    }




    await interaction.editReply({
      content: `✅ Successfully DMed the tutorial to ${target.user.tag}.`,
    });
  },
};

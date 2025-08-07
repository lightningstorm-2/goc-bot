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
    .setName("nco_recruit")
    .setDescription(
      "Recruit a new NCO member by assigning roles and sending promotion info."
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to promote")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const allowedRoles = [
      "989415856347971636",
      "1215866479514484786",
      "989415778178715649",
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

    const target = interaction.options.getMember("user");
    if (!target) {
      return interaction.editReply({
        content: "⚠️ Couldn't find the user in this server.",
      });
    }

    const rolesToAdd = [
      "1213603754595852358",
      "1349692317174599702",
      "1335749823143346329",
    ];
    const roleToRemove = [
      "1183472732055289876",
      "1183471903172743198",
    ];

    try {
      await target.roles.add(rolesToAdd);
      await target.roles.remove(roleToRemove);
    } catch (err) {
      console.error("❌ Role modification error:", err);
      return interaction.editReply({
        content: "⚠️ Failed to modify roles for the target user.",
      });
    }

    const dmEmbed = new EmbedBuilder()
      .setTitle("<:command_staff:1350085916890501120> | 𝗡𝗢𝗡 𝗖𝗢𝗠𝗠𝗜𝗦𝗦𝗜𝗢𝗡𝗘𝗗 𝗢𝗙𝗙𝗜𝗖𝗘𝗥 𝗣𝗥𝗢𝗚𝗥𝗔𝗠")
      .setColor("#589FFF")
      .setDescription(
        `
        <:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828><:WGOC:1359126547960823899><:BGOC:1359126543971913828>
          `
      )
      .setFields(
        {
          name: "𝐈𝐍𝐓𝐑𝐎𝐃𝐔𝐂𝐓𝐈𝐎𝐍",
          value:
            "First off, welcome! You’ve officially become a Non-Commissioned Officer in one of the largest and most respected factions in all of SCP: Roleplay — the Global Occult Coalition. Congratulations!\nWith this new role, you’re now a representative of your unit, your division, and the GOC as a whole. From this point on, how you present yourself in both the GOC and the wider community matters. Act with professionalism, discipline, and common sense — or expect consequences more severe than what you got as an MR.",
        },
        {
          name: "𝐓𝐈𝐏𝐒, 𝐓𝐑𝐈𝐂𝐊𝐒 & 𝐓𝐑𝐀𝐃𝐈𝐓𝐈𝐎𝐍𝐒",
          value:
            "- Plan before hosting. Know what your deployment will be about before you rally the squad.\n- We brought you here for a reason — don’t make us regret it.\n- Use common sense. Don’t act like a clown. We don’t want a circus.\n- You’re not High Command. Don’t try to act like it. If someone is overstepping, report them — don’t imitate them.\n- When General goes online and NA/Asia are active, take the chance and host!\n- Actually, forget waiting — just host whenever you can.\n- Make your damn punishment logs. No logs = no proof = no accountability = you’re in trouble.\n- Confused? DM your nearest HC or Division Leader. Don’t sit there guessing.\n- Don’t spam or annoy HC. Being a pest won’t get you far.\n- Host tryouts don’t know how learn by co-hosting with an HR.\n**GOLDEN RULE:** Don’t do something dumb, and definitely don’t do something insanely dumb. That’s how careers end fast.",
        },
        {
          name: "𝐒𝐈𝐓𝐄𝐒",
          value:
            "We are currently operational on three sites:\n- **Site-64:** [Main Server](https://discord.gg/eUVsQBzmRy), [Factions Hub](https://discord.gg/72KzdHtfBw)\n- **Site Virtus:** [Main Server](https://discord.gg/8rmAyFNEsE), [Factions Hub](https://discord.gg/Q88HVArnB6)\n- **Site-73:** [Main Server](https://discord.gg/ghhNQgWVGS), [Factions Hub](https://discord.gg/NpUP85DQYx)\n- **Site-56:** [Main Server](https://discord.gg/4PyCBjYgbx), [Factions Hub](https://discord.gg/vmc9YHqMzf)\nUnderstand their regulations are very different from each other. It's recommended to get yourself familiarized with their own handbooks.",
        },
        {
          name: "𝗪𝗛𝗔𝗧 𝗡𝗢𝗪?",
          value:
            "You’re now part of the GOC Officer corps — with that comes power, responsibility, and visibility. Use it well. Make sure to hit your quota, stay active, and don’t screw up.\nIf you’re unsure of something, ask someone who knows. HC, veteran HRs, hell — even an MR if they’ve got the right info. Just don’t guess.\n\n- *If you have any questions, feel free to ask HICOM or Command Staff. Good luck!*",
        }
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("GOC: Officer Corps Server")
        .setStyle(ButtonStyle.Link)
        .setURL(
          "https://discord.gg/FaVGAJChSt"
        )
        .setEmoji("<:command_staff:1350085916890501120>"),
    );

    try {
      await target.send({ embeds: [dmEmbed], components: [row] });
    } catch {
      await interaction.editReply({
        content: "⚠️ Couldn't send a DM to the user.",
      });
      return;
    }

    await interaction.editReply({
      content: `✅ Successfully promoted ${target.user.tag} to NCO.`,
    });
  },
};

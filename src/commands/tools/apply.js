const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Applicant = require("../../schemas/application");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("apply")
    .setDescription("Apply for the GOC.")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  async execute(interaction, client) {
    const applicationRoleId = "1356706851281965136";
    if (!interaction.member.roles.cache.has(applicationRoleId)) {
      return interaction.reply({
        content: "❌ You must have the application role to use this command.",
        ephemeral: true,
      });
    }

    const user = interaction.user;
    const dmChannel = await user.createDM();
    await dmChannel.send("📋 Starting your GOC application. Please answer the following questions clearly.");

    const questions = [
      { q: "1. What do you do if you see a faction member with a red dot?\nA. Kill them on sight.\nB. Check if they're hostile. If not, move along. \nC. Report them to site security.\nD. Arrest them.", key: "q1" },
      { q: "2. A Safe-class entity is walking around, not hurting anyone. What do you do?\nA. Terminate the anomaly immediately.\nB. Capture the anomaly without telling anyone.\nC. Alert in-radio and wait for confirmation or roleplay interaction.\nD. Recontain the anomaly back to its cell.", key: "q2" },
      { q: "3. A Security Department personnel tells you to leave a restricted area. Do you:\nA. Tell them you’re GOC and outrank them.\nB. Refuse and say you're patrolling.\nC. Obey unless you were authorized.\nD. Confront the personnel and assault them.", key: "q3" },
      { q: "4. Someone keeps trolling during a deployment on Serious roleplay, mic-spamming on VC and disturbing your colleagues. What do you do?\nA. Mute them and keep quiet.\nB. Join in for the fun.\nC. Call them out in-game.\nD. Report it to Command Staff or PSYCHE.", key: "q4" },
      { q: "5. Which of the following is considered Fail Roleplay?\nA. Forgetting to use quotation marks.\nB. Using knowledge your character wouldn’t know in RP.\nC. Breaking into a containment chamber without reason.\nD. Talking randomly out of roleplay.", key: "q5" },
      { q: "6. What is the first mission of the Global Occult Coalition?\nA. Concealing anomalies.\nB. Educating others about parathreats.\nC. Ensuring humanity’s survival.\nD. Killing every anomaly on sight.", key: "q6" },
      { q: "Written Response:\nWrite 2–4 sentences per answer. Be clear and professional.\n\n1: If you die during roleplay, what are you allowed to remember in RP when you respawn? Explain New Life Rule.", key: "w1" },
      { q: "2. What should you do if someone is roleplaying something inappropriate (like ERP or Torture Roleplay)?", key: "w2" },
      { q: "3. In your own words, how are you expected to act when deploying as GOC?", key: "w3" },
      { q: "4. What does the GOC mean by the precept “You Are Not Disposable”? Describe it in your own words.", key: "w4" },
    ];

    const responses = {};
    let currentIndex = 0;

    const askNextQuestion = async () => {
      if (currentIndex < questions.length) {
        const formattedQuestion = `\`\`\`\n${questions[currentIndex].q}\n\`\`\``;
        await dmChannel.send(formattedQuestion);
      } else {
        // All questions answered
        await Applicant.findOneAndUpdate(
          { userId: user.id },
          { userId: user.id, responses },
          { upsert: true }
        );

        await dmChannel.send("✅ Thank you! Your application has been submitted for review.");

        const staffGuild = client.guilds.cache.get("1142991341811408948");
        const staffChannel = staffGuild.channels.cache.get("1356709207524511854");

        const staffEmbed = new EmbedBuilder()
          .setTitle("📨 New Application Received")
          .setDescription(`Application from <@${user.id}>`)
          .setColor("Blue")
          .setTimestamp();

        Object.entries(responses).forEach(([key, answer]) => {
          staffEmbed.addFields({ name: key.toUpperCase(), value: answer, inline: false });
        });

        await staffChannel.send({
          content: `New application from <@${user.id}>`,
          embeds: [staffEmbed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  label: "✅ Accept",
                  style: 3,
                  custom_id: `accept_app_${user.id}`,
                },
                {
                  type: 2,
                  label: "❌ Deny",
                  style: 4,
                  custom_id: `deny_app_${user.id}`,
                },
              ],
            },
          ],
        });
      }
    };

    const collector = dmChannel.createMessageCollector({
      filter: (m) => m.author.id === user.id,
      time: 15 * 60 * 1000, // 15 minutes max
    });

    collector.on("collect", async (msg) => {
      const currentQ = questions[currentIndex];
      if (!currentQ) {
        console.error("❌ Reached invalid question index:", currentIndex);
        collector.stop();
        return;
      }
    
      responses[currentQ.key] = msg.content;
      currentIndex++;
      await askNextQuestion();
    });
    
    collector.on("end", async (collected, reason) => {
      if (reason === "time" && currentIndex < questions.length) {
        await dmChannel.send("⏰ You took too long. Application canceled.");
      }
    });

    await interaction.reply({ content: "📩 Application has been sent to your DMs.", ephemeral: true });
    await askNextQuestion();
  },
};

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { commands, buttons, selectMenus } = client;

    try {
      // Slash Commands
      if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction, client);
      }

      // Buttons with dynamic customId (e.g., accept_app_USERID)
      else if (interaction.isButton()) {
        const customId = interaction.customId;

        // Find matching button by prefix
        const buttonKey = Array.from(buttons.keys()).find((key) =>
          customId.startsWith(key)
        );
        const button = buttons.get(customId) || [...buttons.values()].find(btn => customId.startsWith(btn.data.name));


        if (!button) {
          console.warn(`❌ No button handler found for: ${customId}`);
          return;
        }

        await button.execute(interaction, client);
      }

      // Select Menus
      else if (interaction.isSelectMenu()) {
        const menu = selectMenus.get(interaction.customId);
        if (!menu) {
          console.warn(`❌ No select menu handler found for: ${interaction.customId}`);
          return;
        }

        await menu.execute(interaction, client);
      }

    } catch (error) {
      console.error("❌ Error in interactionCreate:", error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "⚠️ Something went wrong.", ephemeral: true });
      } else {
        await interaction.reply({ content: "⚠️ Something went wrong.", ephemeral: true });
      }
    }
  },
};

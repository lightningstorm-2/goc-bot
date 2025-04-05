require("dotenv").config();
const { token, databaseToken } = process.env;
const { connect } = require('mongoose');
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const StatusMessage = require('./schemas/statusMessage');
const channelId = "1357987759721287700";

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

// Bot startup logic
client.once("ready", async () => {
  const channel = await client.channels.fetch(channelId);
  const status = await StatusMessage.findById("statusDoc");

  // Delete shutdown message if exists
  if (status?.shutdownMessageId) {
    try {
      const shutdownMsg = await channel.messages.fetch(status.shutdownMessageId);
      await shutdownMsg.delete();
    } catch (err) {
      console.log("No shutdown message to delete.");
    }
  }

  // Send online message
  const onlineMsg = await channel.send("✅ Bot is now **online**!");

  // Save to DB
  await StatusMessage.findByIdAndUpdate(
    "statusDoc",
    {
      _id: "statusDoc",
      onlineMessageId: onlineMsg.id,
      shutdownMessageId: null,
      channelId: channelId,
    },
    { upsert: true }
  );

  console.log("✅ Bot startup message sent.");
});

// Graceful shutdown logic
const shutdownHandler = async () => {
  try {
    const status = await StatusMessage.findById("statusDoc");
    if (!status) return process.exit(0);

    const channel = await client.channels.fetch(status.channelId);

    // Delete previous online message
    if (status.onlineMessageId) {
      try {
        const onlineMsg = await channel.messages.fetch(status.onlineMessageId);
        await onlineMsg.delete();
      } catch (err) {
        console.log("No online message to delete.");
      }
    }

    // Send shutdown message
    const shutdownMsg = await channel.send("⚠️ Bot is shutting down for scheduled restart...");

    // Save shutdown message ID
    await StatusMessage.findByIdAndUpdate("statusDoc", {
      onlineMessageId: null,
      shutdownMessageId: shutdownMsg.id,
    });

    console.log("🛑 Shutdown message sent.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown handler:", err);
    process.exit(1);
  }
};

// Handle shutdown on Railway auto-restart (12 hours)
setTimeout(shutdownHandler, 12 * 60 * 60 * 1000); // 12 hours

client.handleEvents();
client.handleCommands();
// client.handleComponents();

client.login(token);
(async () => {
  await connect(databaseToken).catch(console.error);
})();

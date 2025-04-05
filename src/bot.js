require("dotenv").config();
const { token, databaseToken } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const StatusMessage = require("./schemas/statusMessage");
const channelId = "1357987759721287700";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.commandArray = [];

// Load functions
const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

client.handleEvents();
client.handleCommands();

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  const status = await StatusMessage.findById("statusDoc").lean();
  const channel = await client.channels.fetch(channelId).catch(console.error);

  if (!channel) {
    console.error("❌ Could not fetch channel.");
    return;
  }

  // Delete previous shutdown message
  if (status?.shutdownMessageId) {
    try {
      const msg = await channel.messages.fetch(status.shutdownMessageId);
      await msg.delete();
      console.log("🗑️ Deleted previous shutdown message.");
    } catch (err) {
      console.warn("⚠️ Could not delete shutdown message:", err.message);
    }
  }

  // Delete previous online message
  if (status?.onlineMessageId) {
    try {
      const msg = await channel.messages.fetch(status.onlineMessageId);
      await msg.delete();
      console.log("🗑️ Deleted previous online message.");
    } catch (err) {
      console.warn("⚠️ Could not delete online message:", err.message);
    }
  }

  // Send new online message
  const newMsg = await channel.send("✅ Bot is now **online**!");

  await StatusMessage.findByIdAndUpdate(
    "statusDoc",
    {
      _id: "statusDoc",
      onlineMessageId: newMsg.id,
      shutdownMessageId: null,
      channelId,
    },
    { upsert: true }
  );

  console.log("📨 Sent online message and updated DB.");
});

// Shutdown handler
const shutdownHandler = async () => {
  console.log("⚠️ Preparing for scheduled shutdown...");
  try {
    const status = await StatusMessage.findById("statusDoc");
    if (!status) return process.exit(0);

    const channel = await client.channels.fetch(status.channelId);

    // Delete last online message
    if (status.onlineMessageId) {
      try {
        const msg = await channel.messages.fetch(status.onlineMessageId);
        await msg.delete();
        console.log("🗑️ Deleted online message before shutdown.");
      } catch (err) {
        console.warn("⚠️ Failed to delete online message:", err.message);
      }
    }

    // Send shutdown message
    const shutdownMsg = await channel.send("🔻 Bot is shutting down...");

    await StatusMessage.findByIdAndUpdate("statusDoc", {
      shutdownMessageId: shutdownMsg.id,
      onlineMessageId: null,
    });

    console.log("📨 Sent shutdown message.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Shutdown error:", err);
    process.exit(1);
  }
};

// Shutdown after 12 hours
setTimeout(shutdownHandler, 12 * 60 * 60 * 1000);

// Connect to MongoDB and login
(async () => {
  await connect(databaseToken).catch(console.error);
  client.login(token);
})();

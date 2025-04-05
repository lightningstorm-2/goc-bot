require("dotenv").config();
const { token, databaseToken } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require("discord.js");
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

  // Create an embed message
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const formattedDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const embed = new EmbedBuilder()
    .setTitle("🟢 Bot Online")
    .setDescription(`> **The Engine** is now online as of:\n📅 ${formattedDate}\n⏰ ${formattedTime}`)
    .setColor("Green")
    .setThumbnail(client.user.displayAvatarURL())
    .setFooter({ text: "Status update", iconURL: client.user.displayAvatarURL() });

  const newMsg = await channel.send({ embeds: [embed] });

  await StatusMessage.findByIdAndUpdate(
    "statusDoc",
    {
      _id: "statusDoc",
      onlineMessageId: newMsg.id,
      channelId,
    },
    { upsert: true }
  );

  console.log("📨 Sent online message and updated DB.");
});

// Graceful shutdown (deletes online message before exit)
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

    await StatusMessage.findByIdAndUpdate("statusDoc", {
      onlineMessageId: null,
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Shutdown error:", err);
    process.exit(1);
  }
};

// Shutdown after 12 hours
setTimeout(() => {
  console.log("🔁 Restarting bot to reduce memory usage...");
  shutdownHandler();
}, 12 * 60 * 60 * 1000); // 12 hours

// MongoDB and login
(async () => {
  await connect(databaseToken).catch(console.error);
  client.login(token);
})();

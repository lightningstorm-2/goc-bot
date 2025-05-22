const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns API Latency, Client Ping, Bot Uptime, and MongoDB Status.'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        const apiLatency = client.ws.ping;
        const clientPing = message.createdTimestamp - interaction.createdTimestamp;

        const botUptime = `<t:${Math.floor(client.startTimestamp / 1000)}:F>`;
        const mongoStatus = mongoose.connection.readyState === 1 ? "🟢 Connected" : "🔴 Not Connected";

        const replyMessage = 
            `**Ping Info**\n` +
            `API Latency: ${apiLatency} ms\n` +
            `Client Ping: ${clientPing} ms\n\n` +
            `🕒 **Uptime**: ${botUptime}\n` +
            `🗄️ **MongoDB**: ${mongoStatus}`;

        await interaction.editReply({
            content: replyMessage
        });
    }
};

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    setInterval(client.pickPresence, 10 * 1000);
    console.log(`${client.user.tag} is now online!`);
  },
};

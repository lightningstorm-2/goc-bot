const { ActivityType } = require('discord.js');

module.exports = (client) => {
  client.pickPresence = async () => {
    const options = [
      {
        type: ActivityType.Watching,
        text: "over DestinedCover's Global Occult Coalition",
        status: "online",
      },
      {
        type: ActivityType.Watching,
        text: "over PSYCHE",
        status: "online",
      },
      {
        type: ActivityType.Watching,
        text: "over Broken Dagger",
        status: "online",
      },
      {
        type: ActivityType.Watching,
        text: "over Noble Phantom",
        status: "online",
      },
      {
        type: ActivityType.Watching,
        text: "over Hazard",
        status: "online",
      },
      {
        type: ActivityType.Watching,
        text: "over PLOTEMY",
        status: "online",
      },
      {
        type: ActivityType.Watching,
        text: "over Black Horizon",
        status: "online",
      },
    ];

    const option = Math.floor(Math.random() * options.length);

    client.user
      .setPresence({
        activities: [
          {
            name: options[option].text,
            type: options[option].type,
          },
        ],
        status: options[option].status,
      });
  };
};

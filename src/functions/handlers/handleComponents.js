const { readdirSync } = require("fs");

module.exports = (client) => {
  client.handleComponents = async () => {
    // ✅ Initialize collections
    client.buttons = new Map();
    client.selectMenus = new Map();

    const componentFolders = readdirSync(`./src/components`);

    for (const folder of componentFolders) {
      const componentFiles = readdirSync(`./src/components/${folder}`).filter(
        (file) => file.endsWith(".js")
      );

      switch (folder) {
        case "buttons":
          for (const file of componentFiles) {
            const button = require(`../../components/${folder}/${file}`);
            if (button?.data?.name) {
              client.buttons.set(button.data.name, button);
              console.warn(`⚠️ Button in ${file} is missing a name.`);
              continue;
            }

            // Use prefix for dynamic buttons (like accept_app_123)
            client.buttons.set(button.data.name, button);
          }
          break;

        case "selectMenus":
          for (const file of componentFiles) {
            const menu = require(`../../components/${folder}/${file}`);
            if (!menu?.data?.name) {
              console.warn(`⚠️ SelectMenu in ${file} is missing a name.`);
              continue;
            }

            client.selectMenus.set(menu.data.name, menu);
          }
          break;

        default:
          break;
      }
    }
  };
};

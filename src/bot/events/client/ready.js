const { REST, Routes, ActivityType } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(process.env.token);
let log = require('stratos-logger');

module.exports = async (bot) => {
    try {
        log.success('Discord Bot is online!');
        log.startup("acro", "blue");

        require("../../../express/index.js")(bot);

        await rest.put(Routes.applicationCommands(bot.user.id), { body: bot.commands.map(c => c.help) });

        bot.user.setPresence({
            activities: [{ name: config.status.msg, type: ActivityType[config.status.type] }],
            status: config.status.status_type
        });

    } catch (e) {
        console.error(e);
    }
};

const { readdirSync } = require('fs');
const path = require('path');

module.exports = (bot) => {
    try {
        const commandPath = path.join(__dirname, '../commands');
        readdirSync(commandPath).forEach(dir => {
            readdirSync(path.join(commandPath, dir))
                .filter(file => file.endsWith('.js'))
                .forEach(file => {
                    const command = require(path.join(commandPath, dir, file));
                    if (command.help?.name) {
                        bot.commands.set(command.help.name, command);
                        command.aliases?.forEach(alias => bot.aliases.set(alias, command));
                    }
                });
        });
    } catch (e) {
        console.error(e.stack);
    }
};

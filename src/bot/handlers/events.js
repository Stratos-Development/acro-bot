const { readdirSync } = require('fs');
const path = require('path');
let log = require('stratos-logger');

module.exports = async (bot) => {
    try {
        const loadDir = dir => readdirSync(path.join(__dirname, '../events', dir))
            .filter(file => file.endsWith('.js'))
            .forEach(file => bot.on(file.slice(0, -3), require(path.join(__dirname, '../events', dir, file)).bind(null, bot)));

        ['client', 'server'].forEach(loadDir);

        log.verbose?.('Connecting to Discord...');
    } catch (e) {
        console.error('Error loading events:', e.stack);
    }
};

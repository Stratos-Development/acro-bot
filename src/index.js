const fs = require('fs');
const path = require('path');
const filePath = path.resolve('config.json');

const loadJsonFile = () => {
    try {
        global.config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
        console.error('Error reading JSON file:', err);
    }
};
loadJsonFile();
fs.watch(filePath, (eventType, filename) => {
    if (filename && eventType === 'change') loadJsonFile();
});

require('./bot/index');

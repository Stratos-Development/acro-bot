const { EmbedBuilder } = require('discord.js');

module.exports = {
    formatBytes: async bytes => {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
    }
};

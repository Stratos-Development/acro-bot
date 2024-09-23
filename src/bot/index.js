const { GatewayIntentBits, Client, Partials, Collection } = require('discord.js');
require('dotenv').config();

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
    ],
    messageCacheLifetime: 60,
    fetchAllMembers: true,
    messageCacheMaxSize: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    disableEveryone: true,
    partials: [Partials.Channel]
});

bot.login(process.env.token)
    .then(() => {
        bot.commands = new Collection();
        bot.aliases = new Collection();
        bot.cooldowns = new Collection();

        ['command', 'events'].forEach(handler => require(`./handlers/${handler}`)(bot));
    })
    .catch(error => log.warning(error));

module.exports.bot = bot;

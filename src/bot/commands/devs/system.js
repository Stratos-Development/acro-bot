const { EmbedBuilder, version: discordJsVersion } = require("discord.js");
const os = require('os');
const ms = require('ms');
const { formatBytes } = require('../../handlers/functions.js');

module.exports.run = async (bot, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const { user, guilds, channels, commands } = bot;
    const { tag, id, createdTimestamp } = user;
    const core = os.cpus()[0];

    // Ensure formatBytes is awaited if it's a promise
    const formattedHeapUsed = await formatBytes(process.memoryUsage().heapUsed);
    const formattedTotalMem = await formatBytes(os.totalmem());

    const botInfo = {
        name: tag,
        id,
        uptime: ms(bot.uptime, { long: true }),
        commands: commands.size,
        servers: guilds.cache.size.toLocaleString(),
        users: guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString(),
        channels: channels.cache.size.toLocaleString(),
        creationDate: `<t:${Math.floor(createdTimestamp / 1000)}:d>`,
        nodeVersion: process.version,
        botVersion: require('../../../../package.json').version,
        discordJsVersion,
        sourceCommit: `[${process.env.SOURCE_COMMIT?.substring(0, 7)}](https://github.com/AcroRoleplay/acrobot/commit/${process.env.SOURCE_COMMIT})`,
    };

    const systemInfo = {
        platform: process.platform,
        uptime: `<t:${Math.floor((Date.now() - os.uptime() * 1000) / 1000)}:R>`,
        cpu: `${os.cpus().length} cores, ${core.model} @ ${core.speed}MHz`,
        memory: `${formattedHeapUsed} / ${formattedTotalMem}`,
    };

    const embed = new EmbedBuilder()
        .setTitle('🤖 Bot Information')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: '⚙️ General Info', value: `<:bulletPoint:1265802894553387058>Client: ${botInfo.name}\n<:bulletPoint:1265802894553387058>ID: ${botInfo.id}\n<:bulletPoint:1265802894553387058>Uptime: ${botInfo.uptime}\n<:bulletPoint:1265802894553387058>Creation Date: ${botInfo.creationDate}`, inline: false },
            { name: '🤖 Bot Stats', value: `<:bulletPoint:1265802894553387058>Commands: ${botInfo.commands}\n<:bulletPoint:1265802894553387058>Servers: ${botInfo.servers}\n<:bulletPoint:1265802894553387058>Users: ${botInfo.users}\n<:bulletPoint:1265802894553387058>Channels: ${botInfo.channels}`, inline: false },
            { name: '📃 Versions', value: `<:bulletPoint:1265802894553387058>Node.js: ${botInfo.nodeVersion}\n<:bulletPoint:1265802894553387058>Bot Version: v${botInfo.botVersion}\n<:bulletPoint:1265802894553387058>Discord.js: v${botInfo.discordJsVersion}\n<:bulletPoint:1265802894553387058>Commit #: ${botInfo.sourceCommit}`, inline: false },
            { name: '💽 System Info', value: `<:bulletPoint:1265802894553387058>Platform: ${systemInfo.platform}\n<:bulletPoint:1265802894553387058>Uptime: ${systemInfo.uptime}\n<:bulletPoint:1265802894553387058>CPU: ${systemInfo.cpu}\n<:bulletPoint:1265802894553387058>Memory: ${systemInfo.memory}`, inline: false }
        )
        .setColor(process.env.main_color || '#7289DA')
        .setFooter({ text: 'Bot Information', iconURL: user.displayAvatarURL() })
        .setTimestamp();

    interaction.editReply({ embeds: [embed], ephemeral: true });
};

module.exports.help = {
    name: "system",
    description: "Display information about the bot",
    category: "dev",
};

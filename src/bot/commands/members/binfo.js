const { EmbedBuilder } = require("discord.js");
const moment = require('moment');
require("moment-duration-format");

module.exports.run = async (bot, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const duration = moment.duration(bot.uptime).format("D [days], H [hrs], m [mins], s [secs]");
    const bulletPoint = "<:bulletPoint:1265802894553387058>";

    const embed = new EmbedBuilder()
        .setColor(process.env.main_color)
        .setAuthor({
            name: `${bot.user.username} Bot Information`,
            iconURL: bot.user.displayAvatarURL({ dynamic: true })
        })
        .addFields(
            { name: '**Username**', value: `${bulletPoint} ${bot.user.username}`, inline: true },
            { name: '**Developer**', value: `${bulletPoint} [Tundra8946](https://discord.com/users/149692366419263488)`, inline: true },
            { name: '**Total Commands**', value: `${bulletPoint} ${bot.commands.size}`, inline: true },
            { name: '**Uptime**', value: `${bulletPoint} ${duration}`, inline: true },
            { name: '**Bot Version**', value: `${bulletPoint} ${require('../../../../package.json').version}`, inline: true },
            { name: '**Shards**', value: `${bulletPoint} 1`, inline: true }
        )
        .setTimestamp()
        .setFooter({
            text: 'Information provided by the bot',
            iconURL: bot.user.displayAvatarURL({ dynamic: true })
        });

    interaction.editReply({ embeds: [embed] });
};

exports.help = {
    name: "botinfo",
    description: "Information about the bot.",
    category: "member",
};

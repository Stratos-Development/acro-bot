const { EmbedBuilder } = require('discord.js');

module.exports.run = async (bot, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const checkDays = (date) => `${Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))} day${Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)) === 1 ? '' : 's'} ago`;

    const verificationLevels = {
        1: 'None', 2: 'Low', 3: 'Medium', 4: '(╯°□°）╯︵ ┻━┻', 5: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
    };

    const embed = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL() ?? bot.user.displayAvatarURL()
        })
        .setColor(process.env.main_color)
        .setTitle('Server Information')
        .setDescription(`Here’s a quick overview of **${interaction.guild.name}**`)
        .addFields(
            { name: '<:nameTag:1265807137142210672> Name', value: "<:bulletPoint:1265802894553387058>" + interaction.guild.name, inline: true },
            { name: '<:id:1265804003875225723> ID', value: "<:bulletPoint:1265802894553387058>" + interaction.guild.id, inline: true },
            { name: '👑 Owner', value: "<:bulletPoint:1265802894553387058>" + (await interaction.guild.fetchOwner()).user.username, inline: true },
            { name: '👥 Members', value: `<:bulletPoint:1265802894553387058>${interaction.guild.members.cache.size} total\n<:bulletPoint:1265802894553387058>${interaction.guild.members.cache.filter(m => !m.user.bot).size} humans\n<:bulletPoint:1265802894553387058>${interaction.guild.members.cache.filter(m => m.user.bot).size} bots`, inline: true },
            { name: '🔐 Verification Level', value: "<:bulletPoint:1265802894553387058>" + verificationLevels[interaction.guild.verificationLevel], inline: true },
            { name: '📁 Channels', value: "<:bulletPoint:1265802894553387058>" + interaction.guild.channels.cache.size.toString(), inline: true },
            { name: '🎭 Roles', value: "<:bulletPoint:1265802894553387058>" + interaction.guild.roles.cache.size.toString(), inline: true },
            { name: '🚀 Boost Level', value: "<:bulletPoint:1265802894553387058>" + `Boost Count: ${interaction.guild.premiumSubscriptionCount}\n<:bulletPoint:1265802894553387058> Level: ${interaction.guild.premiumTier}`, inline: true },
            { name: '📅 Creation Date', value: "<:bulletPoint:1265802894553387058>" + `<t:${Math.floor(interaction.guild.createdAt.getTime() / 1000)}:d>`, inline: true }
        )
        .setTimestamp()
        .setFooter({
            text: 'Guild Information',
            iconURL: interaction.guild.iconURL() ?? bot.user.displayAvatarURL()
        });

    interaction.editReply({ embeds: [embed] });
};

module.exports.help = {
    name: "serverinfo",
    description: "Current server information.",
    category: "member"
};

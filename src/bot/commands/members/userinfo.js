const moment = require("moment");
const { EmbedBuilder } = require('discord.js');
const { users } = require("../../../models");

const statusEmojis = {
    online: "<:online:1265804032757334107>  Online",
    idle: "<:idle:1265804025241010318> Idle",
    dnd: "<:dnd:1265804018199040081> Do Not Disturb",
    offline: "<:offline:1265804010921922610> Offline/Invisible"
};

module.exports.run = async (bot, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const target = interaction.options?.getUser('user')
        ? interaction.guild.members.cache.get(interaction.options.getUser('user').id)
        : interaction.guild.members.cache.get(interaction.user.id);

    const user = await users.findOne({ where: { id: target.id } });
    const botStatus = target.bot ? "<:bot:777931325242998794> Yes" : "No";
    let vstatus = ":x: Not playing";

    if (target.presence?.activities.length > 0) {
        const activity = target.presence.activities[0];
        if (activity.type === 'CUSTOM_STATUS') {
            vstatus = activity.state || "";
            if (activity.emoji) {
                const emojiType = activity.emoji.animated ? 'a' : '';
                vstatus = `<${emojiType}:${activity.emoji.name}:${activity.emoji.id}> ${vstatus}`;
            }
        } else {
            vstatus = activity.name || vstatus;
        }
    }

    const embed = new EmbedBuilder()
        .setThumbnail(target.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setAuthor({
            name: target.user.username,
            iconURL: target.user.displayAvatarURL({ format: 'png', dynamic: true }),
            url: `https://discord.com/users/${target.user.id}`
        })
        .setColor({
            online: "#00aa4c",
            dnd: "#9c0000",
            offline: "#747f8d",
            idle: "#faa61a",
            default: "#747f8d"
        }[target.presence?.status] || "#747f8d")
        .addFields(
            { name: '<:nameTag:1265807137142210672> Username', value: "<:bulletPoint:1265802894553387058>" + target.user.username, inline: true },
            { name: '🔗 Nickname', value: `<:bulletPoint:1265802894553387058>${target.nickname ? target.nickname.substring(0, 16) : ':x:None'}`, inline: true },
            { name: '🤖 Bot', value: "<:bulletPoint:1265802894553387058>" + botStatus, inline: true },
            { name: '🟢 Status', value: "<:bulletPoint:1265802894553387058>" + statusEmojis[target.presence?.status] || statusEmojis.offline, inline: true },
            { name: '🎮 Playing', value: "<:bulletPoint:1265802894553387058>" + vstatus || 'Not Playing', inline: true },
            { name: '📅 Joined Discord', value: `<:bulletPoint:1265802894553387058> <t:${moment(target.user.createdAt).unix()}:d>`, inline: true }
        )
        .setTimestamp()


    if (user?.badges.length > 0) {
        const badgeList = user.badges.map(badge => {
            const badgeEmojis = {
                owner: "<:bulletPoint:1265802894553387058> <:owner:1265516255545135157> Server Owner",
                bdev: "<:bulletPoint:1265802894553387058> <:botDev:1265803319822123069> Bot Developer",
                dev: "<:bulletPoint:1265802894553387058> <:opsTeam:1265803427900821670> Acro Ops Team",
                bhunter: "<:bulletPoint:1265802894553387058> <:bug_hunter:1182926648585224222> Bug Hunter",
            };
            return `**${badgeEmojis[badge]}**`;
        }).join("\n");

        embed.addFields({ name: "📌 Badges", value: badgeList, inline: true });
    }

    interaction.editReply({ embeds: [embed] });
};

exports.help = {
    name: "userinfo",
    description: "Get information about a user",
    category: "members",
    options: [
        {
            name: 'user',
            type: 6,
            description: 'User to get info about',
            required: false
        }
    ]
};

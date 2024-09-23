const { EmbedBuilder } = require('discord.js');

module.exports = async (bot, member) => {
    if (!config.modules.InsAndOuts || member.guild.id !== "1259696668752740384") return;

    const logs = member.guild.channels.cache.get("1265745043734532147");

    const leftEmbed = new EmbedBuilder()
        .setTitle("<:userLeft:1265746108555198587> User Left The Server")
        .addFields(
            { name: "👤 Username:", value: member.user.username, inline: true },
            { name: "🕒 Joined:", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
            { name: "📅 Account Created:", value: `<t:${Math.floor(member.user.createdAt / 1000)}:F>`, inline: true },
            { name: "🚪 Left:", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor("Red")
        .setFooter({ text: `User ID: ${member.user.id}` })
        .setTimestamp();

    try {
        logs.send({ embeds: [leftEmbed] });
    } catch (error) {
        console.error(error);
    }
};

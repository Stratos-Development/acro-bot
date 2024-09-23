const { EmbedBuilder } = require('discord.js');

module.exports = async (bot, member) => {
    if (!config.modules.InsAndOuts || member.guild.id !== "1259696668752740384") return;

    const logs = member.guild.channels.cache.get("1265745043734532147");

    const joinedEmbed = new EmbedBuilder()
        .setTitle("<:userJoined:1265746202587303977> User Joined The Server")
        .addFields(
            { name: "👤 Username:", value: member.user.username, inline: true },
            { name: "🕒 Joined:", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
            { name: "📅 Account Created:", value: `<t:${Math.floor(member.user.createdAt / 1000)}:F>`, inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor("Green")
        .setFooter({ text: `User ID: ${member.user.id}` })
        .setTimestamp();

    try {
        await logs.send({ embeds: [joinedEmbed] });
    } catch (error) {
        console.error(error);
    }
};

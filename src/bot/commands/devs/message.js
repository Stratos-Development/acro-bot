const { PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports.run = async (bot, interaction) => {
    const json = interaction.options?.getString("json");
    const channel = interaction.options?.getChannel("channel") || interaction.channel;
    const attachment = interaction.options?.getAttachment("attachment");

    await interaction.deferReply({ ephemeral: true });

    try {
        const { content, embeds, components, actions } = JSON.parse(
            JSON.stringify(JSON.parse(json))
                .replace(/\${bot\.user\.username}/g, bot.user.username)
                .replace(/\${bot\.user\.displayAvatarURL\(\)}/g, bot.user.displayAvatarURL())
        );

        const messageOptions = { content, embeds, components, actions };
        if (attachment) messageOptions.files = [attachment];

        await channel.send(messageOptions);
        await interaction.editReply({ content: "Message Sent Successfully", ephemeral: true });

    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: "Error processing JSON or sending message. Please check your input.", ephemeral: true });
    }
};

exports.help = {
    name: "message",
    description: "Send a message!",
    category: "dev",
    options: [
        {
            name: "json",
            description: "Message JSON (https://message.style/app/editor)",
            type: 3, // STRING type
            required: true
        },
        {
            name: "channel",
            description: "The channel to send the message to.",
            type: 7, // CHANNEL type
            required: false
        },
        {
            name: "attachment",
            description: "Add an attachment to the message.",
            type: 11, // ATTACHMENT type
            required: false
        }
    ]
};

const {
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports.run = async (bot, interaction) => {
    const modal = new ModalBuilder()
        .setCustomId("email-sender")
        .setTitle("New Email...");

    const clearanceLevel = new TextInputBuilder()
        .setCustomId("EMAIL-CL")
        .setLabel("What level clearance?")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

    const sendTo = new TextInputBuilder()
        .setCustomId("EMAIL-TO")
        .setLabel("To who? (TO: | BCC: | CC:)")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph);

    const sendFrom = new TextInputBuilder()
        .setCustomId("EMAIL-FROM")
        .setLabel("From who? (Ex: Overwatch Command)")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

    const emailSubject = new TextInputBuilder()
        .setCustomId("EMAIL-SUBJECT")
        .setLabel("Subject (Ex: Site-71 Budget)")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

    const emailBody = new TextInputBuilder()
        .setCustomId("EMAIL-BODY")
        .setLabel("Message")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph);


    const rowOne = new ActionRowBuilder().addComponents(clearanceLevel);
    const rowTwo = new ActionRowBuilder().addComponents(sendTo);
    const rowThree = new ActionRowBuilder().addComponents(sendFrom);
    const rowFour = new ActionRowBuilder().addComponents(emailSubject);
    const rowFive = new ActionRowBuilder().addComponents(emailBody);

    modal.addComponents(rowOne, rowTwo, rowThree, rowFour, rowFive);

    await interaction.showModal(modal);
};

module.exports.help = {
    name: "email",
    description: "Send email",
    category: "dev",
};

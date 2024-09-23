const { websiteBans } = require("../../../models")
module.exports.run = async (bot, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const subCommand = interaction.options.getSubcommand()
    if (subCommand === "status") {
        const sId = interaction.options.getString("sid")
        const nStatus = interaction.options.getString("nstatus")
        const ban = await websiteBans.findOne({ where: { ban_id: sId } })
        if (!ban) return interaction.editReply("Sorry I can't find that one please try again")
        await ban.update({ status_data: nStatus }, { where: { ban_id: sId } });
        return interaction.editReply(`The ban with the ID#${eId} has been updated with the status \`\`${nStatus}\`\``)
    }
    if (subCommand === "delete") {
        const dId = interaction.options.getString("did")
        const ban = await websiteBans.findOne({ where: { ban_id: dId } })
        if (!ban) return interaction.editReply("Sorry I can't find that one please try again")
        await websiteBans.destroy({ where: { ban_id: dId } });
        return interaction.editReply(`The ban with the ID#${dId} has been deleted`)
    }
    if (subCommand === "data") {
        const eId = interaction.options.getString("eid")
        const eText = interaction.options.getString("etext")
        const ban = await websiteBans.findOne({ where: { ban_id: eId } })
        if (!ban) return interaction.editReply("Sorry I can't find that one please try again")
        await ban.update({ ban_data: eText }, { where: { ban_id: eId } });
        return interaction.editReply(`The ban with the ID#${eId} has been updated with the ban data \`\`${eText}\`\``)
    }
};

exports.help = {
    name: "editban",
    description: "Edit bans on the server!",
    category: "dev",
    options: [
        {
            name: "status",
            description: "Edit the status of a ban",
            type: 1, // SUB_COMMAND type
            options: [
                {
                    name: "sid",
                    description: "The ID of the ban to edit",
                    type: 3, // STRING type
                    required: true
                },
                {
                    name: "nstatus",
                    description: "The new status for the ban",
                    type: 3, // STRING type
                    required: true
                }
            ]
        },
        {
            name: "delete",
            description: "Delete ban",
            type: 1, // SUB_COMMAND type
            options: [
                {
                    name: "did",
                    description: "The ID of the ban to edit",
                    type: 3, // STRING type
                    required: true
                }
            ]
        }, {
            name: "data",
            description: "Edit the ban_data",
            type: 1, // SUB_COMMAND type
            options: [
                {
                    name: "eid",
                    description: "The ID of the ban to edit",
                    type: 3, // STRING type
                    required: true
                },
                {
                    name: "etext",
                    description: "The new data you want for the ban",
                    type: 3, // STRING type
                    required: true
                }
            ]
        }
    ]
};

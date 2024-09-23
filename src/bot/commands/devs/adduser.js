const { users } = require("../../../models");
const { UniqueConstraintError, ValidationError } = require("sequelize");

module.exports.run = async (bot, interaction) => {
    const user = interaction.options.getUser("user");
    const developer = interaction.options.getBoolean("developer");
    const customer = interaction.options.getBoolean("customer");

    await interaction.deferReply({ ephemeral: true });

    try {
        await users.create({
            id: user.id,
            ticketban: false,
            ticketban_reason: null,
            blacklisted: false,
            blacklisted_reason: null,
            dmblacklisted: false,
            dmblacklisted_reason: null,
            developer,
            customer,
            badges: [],
        });

        await interaction.editReply({ content: `${user.tag} has been added to the database.`, ephemeral: true });
    } catch (err) {
        console.error("Error adding user to database:", err);

        const message = err instanceof UniqueConstraintError
            ? "This user already exists in the database."
            : err instanceof ValidationError
                ? "Validation error. Please check your input."
                : "An unexpected error occurred. Please try again later.";

        await interaction.editReply({ content: message, ephemeral: true });
    }
};

exports.help = {
    name: "adduser",
    description: "Adds a user to the database.",
    category: "dev",
    options: [
        { name: "user", description: "The user to add.", type: 6, required: true },
        { name: "developer", description: "Register as a developer?", type: 5, required: true },
        { name: "customer", description: "Register as a customer?", type: 5, required: true },
    ],
};

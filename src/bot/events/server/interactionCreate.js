const { Collection, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { users } = require("../../../models");

module.exports = async (bot, interaction) => {
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'email-sender') {
            const ELevel = interaction.fields.getTextInputValue('EMAIL-CL');
            const EFrom = interaction.fields.getTextInputValue('EMAIL-FROM');
            const ETo = interaction.fields.getTextInputValue('EMAIL-TO');
            const EBody = interaction.fields.getTextInputValue('EMAIL-BODY');
            const ESubject = interaction.fields.getTextInputValue('EMAIL-SUBJECT');
            const embed = new EmbedBuilder()
                .setColor('#151719')
                .setTitle('SCP Foundation Email')
                .setDescription('**This is a secure communication from the SCP Foundation.**')
                .addFields(
                    { name: 'Clearance Level', value: ELevel, inline: true },
                    { name: 'From', value: EFrom, inline: true },
                    { name: 'To', value: ETo, inline: true },
                    { name: 'Subject', value: ESubject, inline: false },
                    { name: '\u200B', value: '\u200B', inline: false },
                    { name: 'Message', value: EBody, inline: false }
                )
                .setFooter({ text: 'SCP Foundation - Secure. Contain. Protect.', iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/SCP_Foundation_%28emblem%29.svg/512px-SCP_Foundation_%28emblem%29.svg.png?20230616232154" })
                .setTimestamp();

            await interaction.reply({ content: 'You\'re email has been send', ephemeral: true });
            interaction.channel.send({ embeds: [embed] })
        }
    }
    if (interaction.isCommand()) {
        const userId = interaction.user.id;
        let user = await users.findOne({ where: { id: userId } });

        if (config.modules.commands === false && !user?.developer) {
            const embed = new EmbedBuilder()
                .setColor("#f5a623")
                .setTitle("📢 Notification")
                .setDescription("Public command access is restricted. Contact the Ops team if you need assistance.")
                .setFooter({ text: "Thank you for your understanding.", iconURL: bot.user.displayAvatarURL() })
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (user?.blacklisted) {
            const embed = new EmbedBuilder()
                .setColor("#f5a623")
                .setTitle("📢 Notification")
                .setDescription(`Your command access is restricted. Contact the Ops team if you need assistance.\n\n Reason: \`\`${user?.blacklisted_reason || "You have been blocked for spamming the commands on Acro Bot."}\`\``)
                .setFooter({ text: "Thank you for your understanding.", iconURL: bot.user.displayAvatarURL() })
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const command = bot.commands.get(interaction.commandName) || bot.commands.get(bot.aliases.get(interaction.commandName));
        if (!command) return;

        if (!user) {
            user = await users.create({
                id: userId,
                ticketban: false,
                blacklisted: false,
                dmblacklisted: false,
                developer: userId === "149692366419263488",
                badges: userId === "149692366419263488" ? ["bdev", "dev", "staff"] : [],
            });
        }

        if (!bot.cooldowns.has(command.name)) {
            bot.cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = bot.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || process.env.defaultCommandCooldown) * 1000;

        if (timestamps.has(userId)) {
            const expirationTime = timestamps.get(userId) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const embed = new EmbedBuilder()
                    .setColor(process.env.main_color)
                    .setTitle(`⏳ Please wait ${timeLeft.toFixed(1)} more second(s) before using the \`${command.help.name}\` command.`)
                    .setDescription("You are on cooldown. Please be patient and try again shortly.")
                    .setFooter({ text: process.env.embed_footer || "Thank you for your patience!", iconURL: bot.user.displayAvatarURL() })
                    .setTimestamp();
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        timestamps.set(userId, now);
        setTimeout(() => timestamps.delete(userId), cooldownAmount);

        try {
            if (command.help.permission && !interaction.guild.members.cache.get(userId).permissions.has(PermissionsBitField.Flags[command.help.permission])) {
                const embed = new EmbedBuilder()
                    .setColor("#f5a623")
                    .setTitle("⚠️ Permission Required")
                    .setDescription(`You need the \`${command.help.permission}\` permission to use this command. Contact a server administrator if you believe you should have access.`)
                    .setFooter({ text: "Thank you for your understanding.", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (command.help.category === "dev" && !user.developer) {
                const embed = new EmbedBuilder()
                    .setColor("#f5a623")
                    .setTitle("⚠️ Permission Required")
                    .setDescription("This command requires developer access. Contact an ops team member if you believe you should have access.")
                    .setFooter({ text: "Thank you for your understanding.", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await command.run(bot, interaction);
        } catch (e) {
            console.error(e.stack);
            const embed = new EmbedBuilder()
                .setColor("#f5a623")
                .setTitle("⚠️ Something Went Wrong")
                .setDescription(process.env.NODE_ENV === "production" ? "An unexpected issue occurred. Please try again later." : `Error:\n\`\`\`${e.stack}\`\`\``)
                .setFooter({ text: "Thank you for your patience.", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
            try {
                return await interaction.reply({ embeds: [embed], ephemeral: true });

            } catch (error) {
                return await interaction.editReply({ embeds: [embed], ephemeral: true });

            }
        }
    }

};

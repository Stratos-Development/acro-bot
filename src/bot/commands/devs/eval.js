const { EmbedBuilder } = require('discord.js');
const { inspect } = require('util');

module.exports.run = async (bot, interaction) => {
    const code = interaction.options.getString('code');
    await interaction.deferReply({ ephemeral: true });
    process.env = {}
    bot.token = ""
    bot.ws["_ws"].options.token = ""
    try {
        let evaled = await eval(code);
        let output = inspect(evaled, { depth: 0 });
        if (output.length >= 1024) {
            const { paste: { id } } = await (await fetch('https://paste.stratostech.xyz/api/v2/paste', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'PASTE', title: 'error.js', content: output, visibility: 'UNLISTED' })
            })).json();
            return interaction.editReply({
                content: `Output too long, view it here: https://paste.stratostech.xyz/${id}`,
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('Evaluation Result')
            .setDescription(`**Time Taken:** ${Date.now() - interaction.createdTimestamp}ms`)
            .setColor('#7289DA')
            .addFields([
                { name: ':inbox_tray: Input', value: `\`\`\`js\n${code}\n\`\`\`` },
                { name: ':outbox_tray: Output', value: `\`\`\`js\n${output}\n\`\`\`` },
                { name: ':information_source: Type', value: `\`\`\`js\n${typeof evaled}\n\`\`\``, inline: true }
            ])
            .setFooter({ text: 'Evaluation Result', iconURL: bot.user.displayAvatarURL() })
            .setTimestamp();

        interaction.editReply({ embeds: [embed], ephemeral: true });

    } catch (error) {
        interaction.editReply({
            embeds: [new EmbedBuilder()
                .setTitle('Error')
                .addFields([{ name: 'Error', value: `${error}` }])
            ],
            ephemeral: true
        });
    }
};

exports.help = {
    name: 'eval',
    description: 'Tests code',
    category: 'dev',
    options: [
        {
            name: 'code',
            type: 3, // STRING type
            description: 'Code to execute',
            required: true
        }
    ]
};

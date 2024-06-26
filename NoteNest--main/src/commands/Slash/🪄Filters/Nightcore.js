const { EmbedBuilder } = require("discord.js");
const delay = require("delay");

module.exports = {
    name: "nightcore",
    description: "Set the current player filter to Nightcore.",
    category: "🪄Filters",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: false,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        await player.filters.setNightcore(true);

        const embed = new EmbedBuilder().setDescription(`\`🔩\` | Filter has been set to: \`Nightcore\``).setColor(client.color);

        await delay(2000);
        return interaction.editReply({ embeds: [embed] });
    },
};

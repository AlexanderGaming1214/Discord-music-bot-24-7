const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { supportUrl, inviteUrl, imageUrl } = require("../../../settings/config.js");
const ms = require("pretty-ms");

module.exports = {
    name: "about",
    description: "Show information about the bot.",
    category: "🛠️Information",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: false,
        sameVc: false,
        player: false,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const playingPlayers = client.poru.leastUsedNodes[0].stats.players;
        let uptime = await client.uptime;

        let scount = client.guilds.cache.size;
        let mcount = 0;

        client.guilds.cache.forEach((guild) => {
            mcount += guild.memberCount;
        });

        const row = new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setLabel("Support").setURL(supportUrl).setStyle(ButtonStyle.Link))
            .addComponents(new ButtonBuilder().setLabel("Invite").setURL(inviteUrl).setStyle(ButtonStyle.Link));

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.members.me.displayName} Info!`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setDescription(
                ` Hello **${interaction.member}**, I am **${client.user}**. A Rich Quality Discord Music Bot. Support  Spotify, SoundCloud, Apple Music ,You yube Music& Others. Use this command for help \`/help\` command.`,
            )
            .addFields([
                { name: `\`🔧\` • Servers`, value: `\`\`\`Total: ${scount} servers\`\`\``, inline: true },
                { name: `\`✨\` • Users`, value: `\`\`\`Total: ${mcount} users\`\`\``, inline: true },
                { name: `\`🎧\` • Players`, value: `\`\`\`Currently used by ${playingPlayers} servers\n\`\`\``, inline: true },
                { name: `\`⌛\` • Uptime`, value: `\`\`\`${ms(uptime)}\`\`\``, inline: true },
                { name: `\`🧩\` • Ping`, value: `\`\`\`${Math.round(client.ws.ping)}ms\`\`\``, inline: true },
                { name: `\`🟢\` • Owners`, value: `\`\`\`_monsterbunny\`\`\``, inline: true },
            ])
            .setImage(imageUrl)
            .setColor(client.color)
            .setFooter({ text: `Thank you for using ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed], components: [row] });
    },
};

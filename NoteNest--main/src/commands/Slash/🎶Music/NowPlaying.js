const { EmbedBuilder } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");
const Guild = require("../../../settings/models/Guild.js");
const capital = require("node-capitalize");

module.exports = {
    name: "nowplaying",
    description: "Show the current playing song.",
    category: "🎶Music",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: false });

        const data = await Guild.findOne({ Id: interaction.guild.id });
        const control = data.playerControl;

        // When button control "enable", this will make command unable to use. You can delete this
        if (control === "enable") {
            const ctrl = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`❌\` | You can't use this command as the player control was enable!`);
            return interaction.editReply({ embeds: [ctrl] });
        }

        if (!player.currentTrack) return;

        try {
            const Titles =
                player.currentTrack.info.title.length > 20
                    ? player.currentTrack.info.title.substr(0, 20) + "..."
                    : player.currentTrack.info.title;
            const Author =
                player.currentTrack.info.author.length > 20
                    ? player.currentTrack.info.author.substr(0, 20) + "..."
                    : player.currentTrack.info.author;
            const currentPosition = formatDuration(player.position);
            const trackDuration = formatDuration(player.currentTrack.info.length);
            const playerDuration = player.currentTrack.info.isStream ? "LIVE" : trackDuration;
            const currentAuthor = player.currentTrack.info.author ? Author : "Unknown";
            const currentTitle = player.currentTrack.info.title ? Titles : "Unknown";
            const Part = Math.floor((player.position / player.currentTrack.info.length) * 30);
            const Emoji = player.isPlaying ? "🕒 |" : "⏸ |";

            let sources = "Unknown";

            if (player.currentTrack.info.sourceName === "youtube") sources = "YouTube";
            else if (player.currentTrack.info.sourceName === "soundcloud") sources = "SoundCloud";
            else if (player.currentTrack.info.sourceName === "spotify") sources = "Spotify";
            else if (player.currentTrack.info.sourceName === "apllemusic") sources = "Apple Music";
            else if (player.currentTrack.info.sourceName === "bandcamp") sources = "Bandcamp";
            else if (player.currentTrack.info.sourceName === "http") sources = "HTTP";
            else if (player.currentTrack.info.sourceName === "deezer") sources = "Deezer";

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: player.isPlaying ? `Now Playing` : `Song Paused`,
                    iconURL: "https://cdn.discordapp.com/attachments/1185515072840273963/1186775062188134531/musica-music.gif?ex=65947968&is=65820468&hm=1e7383ad1443beeac95c92b48977306283304e3cf268abf7cfc066a710b4272b&",
                })
                .setThumbnail(player.currentTrack.info.image)
                .setDescription(`**[${currentTitle}](${player.currentTrack.info.uri})**`)
                .addFields([
                    { name: `Author:`, value: `${currentAuthor}`, inline: true },
                    { name: `Requested By:`, value: `${player.currentTrack.info.requester}`, inline: true },
                    { name: `Source:`, value: `${sources}`, inline: true },
                    { name: `Duration:`, value: `${playerDuration}`, inline: true },
                    { name: `Volume:`, value: `${player.volume}%`, inline: true },
                    { name: `Queue Left:`, value: `${player.queue.length}`, inline: true },
                    {
                        name: `Song Progress: \`[${currentPosition}]\``,
                        value: `\`\`\`${Emoji} ${"─".repeat(Part) + "🔵" + "─".repeat(30 - Part)}\`\`\``,
                        inline: false,
                    },
                ])
                .setColor(client.color)
                .setFooter({ text: `© ${client.user.username}` })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            return interaction.reply({ content: `\`❌\` | Nothing is playing or song has been ended!`, ephemeral: true });
        }
    },
};

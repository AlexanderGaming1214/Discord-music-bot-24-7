const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");

module.exports = {
    name: "play",
    description: "Play your favorite song/s.",
    category: "🎶Music",
    options: [
        {
            name: "query",
            description: "Provide song name/url.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissions: {
        bot: ["Speak", "Connect"],
        channel: ["Speak", "Connect"],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: false,
        player: false,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: false });

        const song = interaction.options.getString("query");

        const embed = new EmbedBuilder().setColor(client.color);

        if (player && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription(`\`❌\` | You must be on the same voice channel as mine to use this command.`).setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        const res = await client.poru.resolve({ query: song, requester: interaction.user });
        const { loadType, tracks, playlistInfo } = res;

        if (loadType === "LOAD_FAILED" || loadType === "NO_MATCHES") {
            embed.setDescription(`\`❌\` | Song was no found or Failed to load song!`);

            return interaction.editReply({ embeds: [embed] });
        }

        if (!player) {
            player = await client.poru.createConnection({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                deaf: true,
            });
        }

        if (player.state !== "CONNECTED") player.connect();

        if (loadType === "PLAYLIST_LOADED") {
            for (const track of tracks) {
                player.queue.add(track);
            }

            embed.setDescription(`<:successful:1201818375274369045> | **[${playlistInfo.name}](${song})** • \`${tracks.length}\` tracks • ${interaction.user}`);

            if (!player.isPlaying && !player.isPaused) player.play();
        } else if (loadType === "SEARCH_RESULT" || loadType === "TRACK_LOADED") {
            const track = tracks[0];

            player.queue.add(track);

            embed.setDescription(
                `<:successful:1201818375274369045> | **[${track.info.title ? track.info.title : "Unknown"}](${track.info.uri})** • \`${
                    track.info.isStream ? "LIVE" : formatDuration(track.info.length)
                }\` • ${interaction.user}`,
            );

            if (!player.isPlaying && !player.isPaused) player.play();
        }

        await interaction.editReply({ embeds: [embed] });
    },
};

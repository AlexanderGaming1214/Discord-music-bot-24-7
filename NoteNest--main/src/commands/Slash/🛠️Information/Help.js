const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { readdirSync } = require("fs");
const {
  supportUrl,
  inviteUrl,
  imageUrl,
} = require("../../../settings/config.js");

module.exports = {
  name: "help",
  description: "Display all commands of the bot.",
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

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Support")
          .setURL(supportUrl)
          .setStyle(ButtonStyle.Link),
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Invite")
          .setURL(inviteUrl)
          .setStyle(ButtonStyle.Link),
      );

    const categories = readdirSync("./src/commands/Slash/");

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.guild.members.me.displayName} Help Command!`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setColor(client.color)
      .setImage(imageUrl)
      .setDescription(
        `Hello **${interaction.member}**, I'm **${client.user}**. You can start listening to music by just joining a voice channel and typing:  \`/play [song name or link]\`\n` +
          ` \n**${client.user.username}** is a Discord music bot that supports Spotify and more!\n**Important Links:**\n|<:bot:1189240728006709348>[WEBSIDE](https://monster-bunny.github.io/NoteNest/) \n|<:prime:1189252947348037753> [SUPPORT](https://monster-bunny.github.io/NoteNest/)\n|<a:247:1184601685121835028>[VOTE](https://monster-bunny.github.io/NoteNest/)`,
      )
      .addFields({
        name: `Command Categories`,
        value: `🎶\`:\` MMUSIC COMMANDS \n🪄\`:\` FILTER COMMANDS \n✨\`:\`UTILITY COMMANDS\n🛠️ \`:\` INFORMATION COMMANDS`,
      })
      .setFooter({
        text: `© ${client.user.username} | Total Commands: ${client.slashCommands.size}`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("help-category")
        .setPlaceholder(`Select Menu Category Commands`)
        .setMaxValues(1)
        .setMinValues(1)
        .setOptions(
          categories.map((category) => {
            return new StringSelectMenuOptionBuilder()
              .setLabel(category)
              .setValue(category);
          }),
        ),
    ]);

    interaction
      .editReply({ embeds: [embed], components: [row, row2] })
      .then(async (msg) => {
        let filter = (i) =>
          i.isStringSelectMenu() &&
          i.user &&
          i.message.author.id == client.user.id;

        let collector = await msg.createMessageComponentCollector({
          filter,
          time: 90000,
        });

        collector.on("collect", async (m) => {
          if (m.isStringSelectMenu()) {
            if (m.customId === "help-category") {
              await m.deferUpdate();

              let [directory] = m.values;

              const embed = new EmbedBuilder()
                .setAuthor({
                  name: `${interaction.guild.members.me.displayName} Help Command!`,
                  iconURL: interaction.guild.iconURL({ dynamic: true }),
                })
                .setDescription(
                  `These are all available commands for this category to use. Try adding [\`/\`] before the commands or you can just click these commands below.\n\n**❯ ${
                    directory.slice(0, 1).toUpperCase() + directory.slice(1)
                  }:**\n${client.slashCommands
                    .filter((c) => c.category === directory)
                    .map((c) => `\`${c.name}\` : *${c.description}*`)
                    .join("\n")}`,
                )
                .setColor(client.color)
                .setImage(imageUrl)
                .setFooter({
                  text: `© ${client.user.username} | Total Commands: ${
                    client.slashCommands.filter((c) => c.category === directory)
                      .size
                  }`,
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

              msg.edit({ embeds: [embed] });
            }
          }
        });

        collector.on("end", async (collected, reason) => {
          if (reason === "time") {
            const timed = new EmbedBuilder()
              .setAuthor({
                name: `${interaction.guild.members.me.displayName} Help Command!`,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              })
              .setDescription(
                `Help Command Menu was timed out, try using \`/help\` to show the help command menu again.\n\nThank You.`,
              )
              .setImage(imageUrl)
              .setColor(client.color)
              .setFooter({
                text: `© ${client.user.username} | Total Commands: ${client.slashCommands.size}`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp();

            msg.edit({ embeds: [timed], components: [row2] });
          }
        });
      });
  },
};

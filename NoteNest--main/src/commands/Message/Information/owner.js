const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { readdirSync } = require("fs");
const { supportUrl, inviteUrl, imageUrl } = require("../../../settings/config.js");

module.exports = {
    name: "Hi",
    description: "chat bot",
    category: "Information",
    aliases: ["hi"], 
    owner: true,
    run: async (client, message, args) => {
        message.reply("Hey My Owner🙃");
        return;
    }
};

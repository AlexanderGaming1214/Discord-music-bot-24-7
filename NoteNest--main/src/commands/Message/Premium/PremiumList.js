const { EmbedBuilder } = require("discord.js");
const User = require("../../../settings/models/User.js");
const moment = require("moment");

module.exports = {
    name: "premiumlist",
    description: "Get list of all premium user.",
    category: "Premium",
    aliases: ["plist"],
    owner: true,
    run: async (client, message) => {
        if (client.config.disabelPremium === true) return message.reply({ content: `\`❌\` | Premium system is disabled.` });

        const users = await User.find();

        let usersData = users.filter((user) => user.isPremium === true);
        let premium = usersData.map(
            (x, index) =>
                `\`\`\`${index + 1}. ${x.Id} | Plan: ${x.premium.plan} | Expire At: ${moment(x.premium.expiresAt).format(
                    "dddd, MMMM Do YYYY",
                )}\`\`\``,
        );

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username} Premium List`, iconURL: client.user.avatarURL({ dynamic: true }) })
            .setColor(client.color)
            .setDescription(premium.join("\n") || "```No Premium User Found```");

        return message.reply({ embeds: [embed] });
    },
};

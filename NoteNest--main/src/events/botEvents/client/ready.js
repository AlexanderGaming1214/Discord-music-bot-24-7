const { ActivityType } = require("discord.js");
const User = require("../../../settings/models/User.js");

module.exports.run = async (client) => {
    await client.poru.init(client, {
        shards: client.cluster.info.TOTAL_SHARDS,
        clientName: client.user.username,
        clientId: client.user.id,
    });

    const users = await User.find();

    await users.forEach(async (user) => {
        client.premium.set(user.Id, user);
    });

    setInterval(async () => {
        const promises = [
            client.cluster.broadcastEval("this.guilds.cache.size"),
            client.cluster.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];

        const results = await Promise.all(promises);

        const servers = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        const members = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

        const status = [
            { type: ActivityType.Playing, name: "/play" },
            { type: ActivityType.Watching, name: `${members} Users` },
            { type: ActivityType.Competing, name: `${servers} Servers` },
            { type: ActivityType.Listening, name: "Songs" }, // Add more statuses if needed
        ];

        const index = Math.floor(Math.random() * status.length);

        client.user.setActivity(status[index].name, { type: status[index].type });

        client.user.setPresence({
            status: "idle", // or "idle" or "dnd"
            activities: [
                {
                    name: status[index].name,
                    type: status[index].type,
                    details: status[index].details,
                },
            ],
            clientStatus: "mobile", // Adjust this as needed
        });
    }, 5000);

    console.log(`[INFO] ${client.user.username} is ready with ${client.guilds.cache.size} server`);
};

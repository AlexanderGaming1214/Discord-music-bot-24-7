const Guild = require("../../../settings/models/Guild.js");

module.exports.run = async (client, node) => {
    console.log(`[INFO] Node ${node.name} Ready!`);

    // This will auto reconnect when the bot is started or has been restarted
    const maindata = await Guild.find();
    const status = maindata.filter((x) => x.reconnect.status === true);

    console.log(`[INFO] Auto ReConnect found in ${status.length} servers!`);

    const connectToPoru = async (data) => {
        const reconnect = data.reconnect;

        const channels = client.channels.cache.get(reconnect.text);
        const voices = client.channels.cache.get(reconnect.voice);

        if (!channels || !voices || reconnect.status === false) return;

        try {
            await client.poru.createConnection({
                guildId: data.Id,
                voiceChannel: reconnect.voice,
                textChannel: reconnect.text,
                deaf: true,
            });

            console.log(`[INFO] Connected to Poru in server ${data.Id}`);
        } catch (error) {
            console.error(`[ERROR] Failed to connect to Poru in server ${data.Id}: ${error.message}`);
        }
    };

    for (let data of maindata) {
        const index = maindata.indexOf(data);

        // Connect to Poru with retry mechanism
        setTimeout(async () => {
            await connectToPoru(data);
        }, index * 5000);
    }
};

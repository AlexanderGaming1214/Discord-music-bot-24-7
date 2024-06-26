require("dotenv").config();
const { customFilter } = require("poru");
const { AppleMusic } = require("poru-applemusic");
const { Deezer } = require("poru-deezer");
const { Spotify } = require("poru-spotify");

const applemusic = new AppleMusic({ contryCode: "us" }); // I dont know why its "contryCode" instead of "countryCode", ask paras for it xD.
const deezer = new Deezer();
const spotify = new Spotify({
    clientID: process.env.SPOTIFY_ID || "c9071d83b23e420e96eaf4294b928477",
    clientSecret: process.env.SPOTIFY_SECRET || "15a74ec5e31d4dd5a7ffb1a0dbe97f90",
    clients: [{ clientID: process.env.SPOTIFY_ID || "c9071d83b23e420e96eaf4294b928477", clientSecret: process.env.SPOTIFY_SECRET || "15a74ec5e31d4dd5a7ffb1a0dbe97f90" }], // its seem this is a bug from the plugin, so if u dont add this, it will throw an error.
});

module.exports = {
    // BOT DETAILS
    token: process.env.TOKEN || "MTE3NDk1MTU0NDEyNzQ5MjEzNw.GThgTn.2qbVCuoPzICDlylEpzPnM-ufmOWdEAlHvj5PoI", // your bot token
    prefix: process.env.PREFIX || "!", // your bot prefix "for owner message command"
    color: process.env.EMBED_COLOR || "#02faac", // your embeded hex color
    owner: process.env.OWNER_ID || " ", // your bot Owners ID
    guildLogs: process.env.GUILD_LOGS || "1176807520216551484", // your server join left logs Channel ID
    leaveTimeout: process.env.LEAVE_TIMEOUT || "1", // set leave TimeOut when bot was alone 1000 = 1sec
    disablePremium: parseBoolean(process.env.DISABLE_PREMIUM || "false"), // disable premium command

    // PORU DETAILS
    poruOptions: {
        customFilter,
        library: "discord.js", // This source made by using discord.js, so don't even try to change this thing :)
        defaultPlatform: process.env.DEFAULT_PLATFORM || "ytmsearch", // recomended using "ytmsearch". You can change this to: "ytsearch" / "ytmsearch" / "scsearch". More Audio Source? Use Lavasrc plugin.
        plugins: [applemusic, deezer, spotify], // Enable applemusic/deezer/spotify LINK to be readable by poru without using LavaSrc plugin.
        reconnectTries: Infinity, // total attemps to try if reconnect failed. you can change it to "Infinity" for unlimited attemps.
        reconnectTimeout: 10000, // total time to try reconnect in ms. 1000 = 1sec
    },
    nodes: [
        {
            name: process.env.NODE_NAME || "Lunox 01", // lavalink node name (anything you want)
            host: process.env.NODE_HOST || "n1.ll.darrennathanael.com", // lavalink host
            port: parseInt(process.env.NODE_PORT || "2269"), //lavalink port
            password: process.env.NODE_PASSWORD || "glasshost1984", //lavalink pass/auth
            secure: parseBoolean(process.env.NODE_SECURE || "false"), //lavalink secure "true/false"
        },
    ],

    // LINK DETAILS
    mongoUri: process.env.MONGO_URI || "https://discord.gg/j5AfKCCQg2", // your MongoDB Url
    supportUrl: process.env.SUPPORT_URL || "https://discord.gg/j5AfKCCQg2", // your Support Server Link
    inviteUrl: process.env.INVITE_URL || "https://monster-bunny.github.io/NoteNest/", // your Bot Invite Link
    imageUrl: process.env.IMAGE_URL || "https://cdn.discordapp.com/attachments/1185515072840273963/1186192698902851614/20231217_015740.png?ex=65925b09&is=657fe609&hm=48141926bed544fe625f3d3a221efe5319e6d34527c2ff3377ee0a578f83b35d&", // your Bot Banner Imange Link to use on "help" & "about" command
};

function parseBoolean(value) {
    if (typeof value === "string") {
        value = value.trim().toLowerCase();
    }
    switch (value) {
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}

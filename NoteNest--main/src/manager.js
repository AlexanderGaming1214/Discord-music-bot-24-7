const MainClient = require("./NoteNest.js");
const client = new MainClient();

client.connect();

module.exports = client;

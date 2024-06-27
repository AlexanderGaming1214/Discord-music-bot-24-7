const { ClusterManager } = require("discord-hybrid-sharding");
const express = require("express");
const path = require("path");
require("dotenv").config();
const keep_alive = require(keep_alive.js)

const app = express();
const manager = new ClusterManager(`${__dirname}/manager.js`, {
    totalShards: "auto",
    shardsPerClusters: 2,
    totalClusters: "auto",
    mode: "process",
    token: process.env.TOKEN || "YOUR_BOT_TOKEN",
});

// Define a route to render information about clusters
app.get("/", (req, res) => {
    // Ensure manager.clusters is an array
    const clusters = Array.isArray(manager.clusters) ? manager.clusters.map(cluster => ({
        id: cluster.id,
        status: cluster.status,
    })) : [];

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Discord Bot Clusters</title>
        </head>
        <body>
            <h1>Discord Bot Clusters</h1>
            <ul>
                ${clusters.map(cluster => `<li>Cluster ${cluster.id}: ${cluster.status}</li>`).join('')}
            </ul>
        </body>
        </html>
    `;

    res.send(html);
});

// Listen on port 3000 (you can change this to any port you prefer)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

manager.on("clusterCreate", (cluster) => console.log(`[INFO] Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });

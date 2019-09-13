"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Manager = new discord_js_1.ShardingManager("./dist/index.js");
Manager.spawn(3);
Manager.on("launch", (shard) => {
    console.log(`Started ${shard.id}`);
});

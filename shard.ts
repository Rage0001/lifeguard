import { ShardingManager } from "discord.js";
const Manager = new ShardingManager("./dist/index.js", {
  totalShards: "auto"
});

Manager.spawn();
Manager.on("launch", (shard) => {
  console.log(`Started ${shard.id}`);
})

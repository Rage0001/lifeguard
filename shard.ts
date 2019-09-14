import { ShardingManager } from "discord.js";
const Manager = new ShardingManager("./dist/index.js");

Manager.spawn(3, 10000).then((shards) => {
  if (process.send) {
    process.send(["start"]);
  }
});

Manager.on("launch", (shard) => {
  console.log(`Started ${shard.id}`);
});

Manager.on("message", (shard, message) => {
  if (message[0] === "restart") {
    if (process.send) {
      process.send(["restart", message[1], shard.id]);
    }
  }
});

process.on("message", (message) => {
  if (message[0] === "restartSuccess") {
    const shard = Manager.shards.get(message[2]);
    if (shard) {
      shard.send(message);
    }
  }
});

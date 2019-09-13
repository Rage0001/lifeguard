#!/usr/bin/env node

/* Node Modules */
const chalk = require('chalk').default;
const cp = require('child_process');
const path = require('path');

let restartChannel = null;

function launch() {
  let child = cp.spawn("node", [path.resolve(__dirname, "dist/shard.js")], {
    stdio: [0, 1, 2, "ipc"]
  });
  
  console.log(chalk.blue("Start:"), `Process ID: ${child.pid}`);

  child.on("error", (error) => console.log(chalk.red("Error:"), err.stack));

  child.on("message", (message) => {
    if (message[0] === "restart") {
      killAndRestart(child);
      restartChannel = message[1]
    } else if (message[0] === "start") {
      if (restartChannel !== null) {
        child.send(["restartSuccess", restartChannel], () => {
          restartChannel = null;
        });
      }
    }
  });

  child.on("close", () => {
    child.removeAllListeners();
    child.unref();
    child = launch();
    // console.log(chalk.blue("Restart: "), `New Process ID: ${child.pid}`);
  });

  return child;
};

function killAndRestart(process) {
  process.kill("SIGINT");
};

launch();
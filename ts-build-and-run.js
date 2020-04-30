#!/usr/bin/env node

/* Modules */
const chalk = require("chalk");
const { spawn } = require("child_process");
const { watch } = require("chokidar");
const ora = require("ora");
const { platform } = require("os");
const { join, resolve } = require("path");

const isWin = platform() === "win32" ? ".cmd" : "";

function tslint() {
  return new Promise(async (res, rej) => {
    const spinner = ora({
      text: "(tslint): Starting TSLint",
      color: "gray"
    }).start();

    let cp = await spawn(
      join(resolve(__dirname, "node_modules"), ".bin", `tslint${isWin}`),
      ["-p", resolve(__dirname)]
    );

    const errors = [];

    cp.stdout.setEncoding("utf8");
    cp.stdout.on("data", data => {
      const err = String(data).trim();
      errors.push(err);
      console.error(`(tslint): ${err}`);
    });

    cp.stdout.on("end", () => {
      if (errors.length <= 0) {
        spinner.succeed("(tslint): Linting Successful");
        res(cp);
      }
    });

    cp.on("error", err => {
      err ? rej(err) : null;
      spinner.fail(`(tslint): ${err.stack}`);
    });

    cp.once("close", () => {
      cp.stdout.removeAllListeners();
      cp.removeAllListeners();
      cp.unref();
    });
  });
}

function tsc() {
  return new Promise(async (res, rej) => {
    const spinner = ora({
      text: "(tsc): Starting Build",
      color: "gray"
    }).start();

    let cp = await spawn(
      join(resolve(__dirname, "node_modules"), ".bin", `tsc${isWin}`),
      ["-p", resolve(__dirname)]
    );

    const errors = [];

    cp.stdout.setEncoding("utf8");
    cp.stdout.on("data", data => {
      const err = String(data).trim();
      errors.push(err);
    });

    cp.stdout.on("end", () => {
      if (errors.length <= 0) {
        spinner.succeed("(tsc): Build Successful");
        res(cp);
      } else {
        spinner.fail("(tsc): Build Errored");
        errors.forEach(err => console.log(err));
      }
    });

    cp.on("error", err => {
      err ? rej(err) : null;
      spinner.fail(`(tsc): ${err.stack}`);
    });

    cp.once("close", () => {
      cp.stdout.removeAllListeners();
      cp.removeAllListeners();
      cp.unref();
    });
  });
}

async function bot() {
  let cp = spawn(
    "node",
    [join(resolve(__dirname, "build"), "src", "index.js")],
    {
      shell: true,
      env: { FORCE_COLOR: true }
    }
  );

  cp.stdout.setEncoding("utf8");
  cp.stdout.on("data", data => {
    const msg = String(data).trim();
    console.log(`(bot): ${msg}`);
  });

  cp.on("error", err => {
    err ? rej(err) : null;
    console.error(`${chalk.red("✘")} (bot): ${err.stack}`);
  });

  cp.once("close", () => {
    cp.stdout.removeAllListeners();
    cp.removeAllListeners();
    cp.unref();
  });

  return cp;
}

const watcher = watch(resolve(__dirname, "src"), {
  persistent: true
});

const spinner = ora("Watching Files for Changes");

watcher.once("ready", async () => {
  let lint = await tslint();
  let build = await tsc();
  let p = await bot();

  console.log();
  spinner.start().succeed();
  console.log();

  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  async function restart() {
    p.once("restart", async () => {
      process.stdout.cursorTo(0, 0);
      process.stdout.clearScreenDown();

      lint.removeAllListeners();
      lint.unref();
      lint = await tslint();

      build.removeAllListeners();
      build.unref();
      build = await tsc();

      p.removeAllListeners();
      p.unref();
      p = await bot();

      console.log();
      spinner.start().succeed();
      console.log();

      process.stdin.resume();
      process.stdin.setEncoding("utf8");
    });

    p.kill("SIGINT");
    if (p.killed) {
      p.emit("restart");
    }
  }

  watcher.on("all", () => {
    process.stdout.cursorTo(0, 0);
    process.stdout.clearScreenDown();
    console.log("Restarting due to File Changes");
    setTimeout(() => restart(), 2000);
  });

  process.stdin.on("data", data => {
    if (String(data).trim() === "rs") {
      process.stdout.cursorTo(0, 0);
      process.stdout.clearScreenDown();
      console.log("Restarting as requested by user");
      setTimeout(() => restart(), 2000);
    }
  });
});

watcher.on("error", err => {
  spinner.fail();
  console.error(err.stack);
});

// @ts-ignore
import chalk from "chalk";
const log = console.log;

export interface ILogger {
  debug: (item: any) => void;
  error: (err: string) => void;
  info: (msg: string) => void;
}

export default {
  debug: (item: any) => {
    log(chalk`{yellow.bold DEBUG:\n}` + item);
  },
  error: (err: string) => {
    log(chalk`{red.bold ERROR:} ${err}`);
  },
  info: (msg: string) => {
    log(chalk`{blue.bold INFO:} ${msg}`);
  }
};

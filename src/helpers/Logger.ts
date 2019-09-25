// @ts-ignore
import chalk from "chalk";
import * as Sentry from "@sentry/node";
import moment from "moment";
const log = console.log;

export interface ILogger {
  debug: (item: any) => void;
  error: (err: string) => void;
  info: (msg: string) => void;
}

export default {
  debug: (item: any) => {
    log(
      `[${moment(moment.now()).format("hh:mm:ss")}]`,
      chalk`{yellow.bold DEBUG: }` + item
    );
  },
  error: (err: string) => {
    log(
      `[${moment(moment.now()).format("hh:mm:ss")}]`,
      chalk`{red.bold ERROR:} ${err}`
    );
    Sentry.captureException(err);
  },
  info: (msg: string) => {
    log(
      `[${moment(moment.now()).format("hh:mm:ss")}]`,
      chalk`{blue.bold INFO:} ${msg}`
    );
  }
};

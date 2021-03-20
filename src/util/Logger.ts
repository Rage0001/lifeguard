import {
  bgBrightBlack,
  bgBrightBlue,
  bgBrightRed,
  bgBrightYellow,
  black,
  brightBlue,
  brightRed,
  brightYellow,
  white,
} from "colors";

export class Logger {
  info = Logger.info;
  warn = Logger.warn;
  error = Logger.error;
  constructor(debugEnabled: boolean) {
    if (!debugEnabled) this.debug = () => {};
  }
  debug(message: string, ...data: any[]) {
    console.debug(
      `${bgBrightBlack(black("[DEBUG]"))} ${white(message)}${
        data.length > 0 ? "\n" : ""
      }`,
      ...data
    );
  }
  static info(message: string) {
    console.info(`${bgBrightBlue(black("[INFO]"))} ${brightBlue(message)}`);
  }
  static warn(message: string) {
    console.info(`${bgBrightYellow(black("[WARN]"))} ${brightYellow(message)}`);
  }
  static error(message: string, ...data: any[]) {
    console.error(
      `${bgBrightRed(black("[ERROR]"))} ${brightRed(message)}${
        data.length > 0 ? "\n" : ""
      }`,
      ...data
    );
  }
}

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
  info(message: string) {
    console.info(`${bgBrightBlue(black("[INFO]"))} ${brightBlue(message)}`);
  }
  warn(message: string) {
    console.info(`${bgBrightYellow(black("[INFO]"))} ${brightYellow(message)}`);
  }
  error(message: string, ...data: any[]) {
    console.error(
      `${bgBrightRed(black("[DEBUG]"))} ${brightRed(message)}${
        data.length > 0 ? "\n" : ""
      }`,
      ...data
    );
  }
}

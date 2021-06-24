import { Injectable, Scope } from '@nestjs/common';
import { magenta } from 'ansi-colors';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {
  private prefix?: string;

  formatLog(data: unknown): string {
    return `[${magenta(this.prefix)}] ${data}`;
  }

  log(message: unknown): void {
    console.log(this.formatLog(message));
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }
}

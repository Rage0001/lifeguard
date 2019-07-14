import { Store } from "../helpers/Store";
import { Command } from "./Command";

export class Plugin {
  public commands: Store<Command>;
  constructor(public name: string) {
    this.commands = new Store<Command>();
  }
}

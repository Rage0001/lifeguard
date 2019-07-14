import { PluginClient } from "../helpers/PluginClient";

type EventFunction = (bot: PluginClient, ...args: any[]) => void;

export class Event {
  constructor(public name: string, public func: EventFunction) {}
}

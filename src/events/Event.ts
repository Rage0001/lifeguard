import { PluginClient } from '../PluginClient';

// tslint:disable-next-line: no-any
type EventFunc = (lifeguard: PluginClient, ...args: any[]) => void;

export class Event {
  constructor(public name: string, public func: EventFunc) {}
}

import { Structures, Guild } from 'discord.js';
import { PluginClient } from 'PluginClient';
import { inspect } from 'util';

Structures.extend('Guild', guildClass => {
  return class extends guildClass {
    _client: PluginClient;
    constructor(client: PluginClient, data: object) {
      super(client, data);
      this._client = client;
    }

    get db() {
      return this._client.db.guilds.findOne({ id: this.id });
    }
  };
});

export class GuildStructure extends Guild {
  _client: PluginClient;
  constructor(client: PluginClient, data: object) {
    super(client, data);
    this._client = client;
  }

  get db() {
    return this._client.db.guilds.findOne({ id: this.id });
  }
}

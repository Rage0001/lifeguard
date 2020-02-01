import { Structures, Guild, GuildMember } from 'discord.js';
import { PluginClient } from 'PluginClient';
import { inspect } from 'util';

Structures.extend('GuildMember', guildMember => {
  return class extends guildMember {
    _client: PluginClient;
    constructor(client: PluginClient, data: object, guild: Guild) {
      super(client, data, guild);
      this._client = client;
    }

    get db() {
      return this._client.db.users.findOne({ id: this.user.id });
    }
  };
});

export class GuildMemberStructure extends GuildMember {
  _client: PluginClient;
  constructor(client: PluginClient, data: object, guild: Guild) {
    super(client, data, guild);
    this._client = client;
  }

  get db() {
    return this._client.db.users.findOne({ id: this.user.id });
  }
}

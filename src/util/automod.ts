import {FilterChannel, GuildDoc} from '@lifeguard/database/Guild';

import {Message} from 'discord.js';
import {PluginClient} from '@lifeguard/PluginClient';

function deleteMessage(lifeguard: PluginClient, msg: Message, reason: string) {
  msg.delete({
    timeout: 1000,
    reason: reason,
  });
}

function wordsMatch(content: string, blocked: string[]) {
  const words = content.split(' ');
  return words.filter(word => blocked.includes(word));
}

function wordsMatchInChannel(
  msg: Message,
  channels: [string, FilterChannel][]
) {
  const channel = channels.find(([channel]) => msg.channel.id === channel);
  if (channel) {
    return wordsMatch(msg.content, channel[1].blockedWords);
  }
  return false;
}

function invites(content: string, whitelist: string[]) {
  const inviteRegex = /(?:https?:\/\/)?(?:www.)?(?:discord(?:.| |[?(?"?'?dot'?"?)?]?)?(?:gg|io|me|li)|discord(:?app)?.com\/invite)\/+((?:(?!https?)[\w\d-])+)/m;
  if (inviteRegex.test(content)) {
    const invite = inviteRegex.exec(content);
    if (invite && !whitelist.includes(invite[2])) {
      return invite;
    }
  }
  return false;
}

function maxMentions(msg: Message, count: number) {
  const mentionRegex = /(<(?:@(?:!|&)?|#)\d+>)/gm;
  const mentions = [
    ...new Set([...msg.content.matchAll(mentionRegex)].map(m => m[0])),
  ];
  if (mentions.length >= count) {
    return mentions.length;
  }
  return false;
}

function maxLines(content: string, count: number) {
  const lines = content.split('\n');
  if (lines.length >= count) {
    return lines.length;
  }
  return false;
}

export function automod(
  lifeguard: PluginClient,
  msg: Message,
  dbGuild: GuildDoc
) {
  if (msg.author.id !== lifeguard.user?.id) {
    if (dbGuild.config.filter.ignoredUsers.includes(msg.author.id)) return;
    if (dbGuild.config.filter.ignoredChannels.includes(msg.channel.id)) return;
    if (
      msg.member?.roles.cache.find(role =>
        dbGuild.config.filter.ignoredRoles.includes(role.id)
      )
    )
      return;
    const blockedWordsCheck = wordsMatch(
      msg.content,
      dbGuild.config.filter.blockedWords
    );
    if (blockedWordsCheck.length > 0) {
      return deleteMessage(
        lifeguard,
        msg,
        `Included blocked word \`${blockedWordsCheck[0]}\``
      );
    }

    const blockedWordsinChannelCheck = wordsMatchInChannel(msg, [
      ...dbGuild.config.filter.channels.entries(),
    ]);
    if (blockedWordsinChannelCheck && blockedWordsinChannelCheck.length > 0) {
      return deleteMessage(
        lifeguard,
        msg,
        `Included blocked word \`${blockedWordsinChannelCheck[0]}\``
      );
    }

    if (dbGuild.config.filter.invites) {
      const invitesCheck = invites(
        msg.content,
        dbGuild.config.filter.inviteWhitelist
      );
      if (invitesCheck) {
        return deleteMessage(
          lifeguard,
          msg,
          `Included invite \`${invitesCheck[0]}\``
        );
      }
    }

    if (dbGuild.config.filter.maxMentions > 0) {
      const maxMentionsCheck = maxMentions(
        msg,
        dbGuild.config.filter.maxMentions
      );
      if (maxMentionsCheck) {
        return deleteMessage(
          lifeguard,
          msg,
          `Included ${maxMentionsCheck} mentions`
        );
      }
    }

    if (dbGuild.config.filter.maxLines > 0) {
      const maxLinesCheck = maxLines(
        msg.content,
        dbGuild.config.filter.maxMentions
      );
      if (maxLinesCheck) {
        return deleteMessage(lifeguard, msg, `Included ${maxLinesCheck} lines`);
      }
    }
  }
}

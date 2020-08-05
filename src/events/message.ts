import {Event} from '@events/Event';
import {Message} from 'discord.js';
import {automod} from '@util/automod';
import {prefix} from '@config/bot';

export const event = new Event('message', async (lifeguard, msg: Message) => {
  let dbUser = await lifeguard.db.users.findById(msg.author.id);
  if (!dbUser) {
    dbUser = await lifeguard.db.users.create({
      _id: msg.author.id,
      blacklisted: false,
      stats: {},
    });
  }

  if (msg.guild) {
    const dbGuild = await lifeguard.db.guilds.findById(msg.guild.id);
    if (!dbGuild) {
      await lifeguard.db.guilds.create({
        _id: msg.guild.id,
        config: {
          filter: {
            channels: new Map(),
          },
          logging: {
            channels: new Map(),
          },
          plugins: {
            dev: {enabled: true},
            debug: {enabled: true},
            info: {enabled: true},
            moderation: {enabled: true},
            admin: {enabled: true},
          },
          starboard: new Map(),
        },
      });
    }

    if (dbGuild) {
      automod(lifeguard, msg, dbGuild);
      // dbGuild.config.filter.blockedWords.forEach(word => {
      //   if (
      //     msg.content.includes(word) &&
      //     msg.author.id !== lifeguard.user?.id
      //   ) {
      //     msg.delete({
      //       timeout: 1000,
      //       reason: `Included blocked word \`${word}\``,
      //     });
      //   }
      //   // TODO: emit event for modlog
      // });
      // const filterChannels = [...dbGuild.config.filter.channels.entries()];
      // filterChannels.forEach(([channel, filter]) => {
      //   if (msg.channel.id !== channel) return;
      //   filter.blockedWords.forEach(word => {
      //     if (
      //       msg.content.includes(word) &&
      //       msg.author.id !== lifeguard.user?.id
      //     ) {
      //       msg.delete({
      //         timeout: 1000,
      //         reason: `Included blocked word \`${word}\``,
      //       });
      //       // TODO: emit event for modlog
      //     }
      //   });
      // });

      // if (dbGuild.config.filter.invites) {
      //   const inviteRegex = /(?:https?:\/\/)?(?:www.)?(?:discord(?:.| |[?(?"?'?dot'?"?)?]?)?(?:gg|io|me|li)|discord(:?app)?.com\/invite)\/+((?:(?!https?)[\w\d-])+)/m;
      //   if (
      //     inviteRegex.test(msg.content) &&
      //     msg.author.id !== lifeguard.user?.id
      //   ) {
      //     const invite = inviteRegex.exec(msg.content);
      //     if (
      //       invite &&
      //       !dbGuild.config.filter.inviteWhitelist.includes(invite[2])
      //     ) {
      //       msg.delete({
      //         timeout: 1000,
      //         reason: `Included invite word \`${invite[0]}\``,
      //       });
      //     }
      //     // TODO: emit event for modlog
      //   }
      // }
    }
  }

  if (dbUser && dbUser.stats) {
    dbUser.stats.totalSentMessages++;
    dbUser.stats.totalSentCharacters += msg.content.length;
    dbUser.stats.totalCustomEmojisUsed +=
      msg.content.match(/<.[^ ]*>/)?.length ?? 0;
    dbUser.stats.totalTimesMentionedAUser += msg.mentions.users.size;
    dbUser.stats.totalSentAttachments += msg.attachments.size;

    await lifeguard.db.users.findByIdAndUpdate(dbUser._id, {
      $set: {stats: dbUser.stats},
    });
  }

  if (!msg.deleted && msg.content.startsWith(prefix)) {
    lifeguard.emit('lifeguardCommandUsed', msg, dbUser);
  }
});

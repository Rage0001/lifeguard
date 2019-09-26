import { Message, MessageReaction, RichEmbed, User } from "discord.js";
import { findUser } from "../../models/User";
import { Command } from "../Command";

export const command = new Command(
  "inf",
  async (msg, args, bot) => {
    try {
      const lang = bot.langs["en-US"].commands.inf;
      switch (args[0]) {
        case "search":
          const user = await findUser(args[1]);
          if (user) {
            const infs = user.get("infractions");
            const infUser = bot.users.get(args[1]);
            if (infUser) {
              const infractionEmbed = new RichEmbed();
              const filteredInfs = infs.filter(
                (i: any) => i.guild === msg.guild.id
              );
              infractionEmbed.setTitle(
                bot.format(lang.displaying, {
                  current: "1",
                  total: filteredInfs.length,
                  user: infUser.tag
                })
              );
              infractionEmbed.setColor("RED");
              infractionEmbed.setFooter(
                bot.format(lang.footer, {
                  user: msg.author.tag
                })
              );
              const fetchedGuild = bot.guilds.get(filteredInfs[0].guild);
              if (fetchedGuild) {
                filteredInfs[0].guild = fetchedGuild.name;
              }
              const fetchedMod = bot.users.get(filteredInfs[0].moderator);
              if (fetchedMod) {
                filteredInfs[0].moderator = fetchedMod.tag;
              }
              infractionEmbed.setDescription(
                bot.format(lang.infDisplay, {
                  action: filteredInfs[0].action,
                  active: filteredInfs[0].active === true ? "Yes" : "No",
                  guild: filteredInfs[0].guild,
                  id: filteredInfs[0].id,
                  mod: filteredInfs[0].moderator,
                  reason: filteredInfs[0].reason,
                  time: filteredInfs[0].time
                })
              );
              const embedMessage = await msg.channel.send(infractionEmbed);
              let page = 0;
              const filter = (reaction: MessageReaction, user: User) =>
                user.id === msg.author.id;
              const reactionCollector = (embedMessage as Message).createReactionCollector(
                filter
              );
              let stopTimer: any;
              const setStopTimer = () => {
                if (stopTimer !== undefined) {
                  clearTimeout(stopTimer);
                }
                stopTimer = setTimeout(() => reactionCollector.stop(), 60000);
              };
              const backwardEmoji = "◀";
              const forwardEmoji = "▶";
              const basketEmoji = "🗑";
              const botReactionBackward = await (embedMessage as Message).react(
                backwardEmoji
              );
              const botReactionForward = await (embedMessage as Message).react(
                forwardEmoji
              );
              reactionCollector.on("collect", (r: MessageReaction) => {
                switch (r.emoji.name) {
                  case forwardEmoji:
                    setStopTimer();
                    const forwardUserReaction = r.message.reactions.filter(
                      r => r.emoji.name === forwardEmoji
                    );
                    forwardUserReaction.first().remove(msg.author);
                    if (page + 1 > filteredInfs.length) {
                      return;
                    }
                    page = page + 1;
                    infractionEmbed.setTitle(
                      bot.format(lang.displaying, {
                        current: `${page + 1}`,
                        total: filteredInfs.length,
                        user: infUser.tag
                      })
                    );
                    const fetchedGuild = bot.guilds.get(
                      filteredInfs[page].guild
                    );
                    if (fetchedGuild) {
                      filteredInfs[page].guild = fetchedGuild.name;
                    }
                    const fetchedMod = bot.users.get(
                      filteredInfs[page].moderator
                    );
                    if (fetchedMod) {
                      filteredInfs[page].moderator = fetchedMod.tag;
                    }
                    infractionEmbed.setDescription(
                      bot.format(lang.infDisplay, {
                        action: filteredInfs[page].action,
                        active:
                          filteredInfs[page].active === true ? "Yes" : "No",
                        guild: filteredInfs[page].guild,
                        id: filteredInfs[page].id,
                        mod: filteredInfs[page].moderator,
                        reason: filteredInfs[page].reason,
                        time: filteredInfs[page].time
                      })
                    );
                    (embedMessage as Message).edit(infractionEmbed);
                    break;
                  case backwardEmoji:
                    setStopTimer();
                    const backwardUserReaction = r.message.reactions.filter(
                      r => r.emoji.name === backwardEmoji
                    );
                    backwardUserReaction.first().remove(msg.author);
                    if (page === 0) {
                      return;
                    }
                    page = page - 1;
                    infractionEmbed.setTitle(
                      bot.format(lang.displaying, {
                        current: `${page + 1}`,
                        total: filteredInfs.length,
                        user: infUser.tag
                      })
                    );
                    const fetchedGuildTwo = bot.guilds.get(
                      filteredInfs[page].guild
                    );
                    if (fetchedGuildTwo) {
                      filteredInfs[page].guild = fetchedGuildTwo.name;
                    }
                    const fetchedModTwo = bot.users.get(
                      filteredInfs[page].moderator
                    );
                    if (fetchedModTwo) {
                      filteredInfs[page].moderator = fetchedModTwo.tag;
                    }
                    infractionEmbed.setDescription(
                      bot.format(lang.infDisplay, {
                        action: filteredInfs[page].action,
                        active:
                          filteredInfs[page].active === true ? "Yes" : "No",
                        guild: filteredInfs[page].guild,
                        id: filteredInfs[page].id,
                        mod: filteredInfs[page].moderator,
                        reason: filteredInfs[page].reason,
                        time: filteredInfs[page].time
                      })
                    );
                    (embedMessage as Message).edit(infractionEmbed);
                    break;
                  case basketEmoji:
                    const basketUserReaction = r.message.reactions.filter(
                      r => r.emoji.name === basketEmoji
                    );
                    basketUserReaction.first().remove(msg.author);
                    reactionCollector.stop();
                    break;
                  default:
                    break;
                }
              });
              reactionCollector.on("end", c => {
                botReactionBackward.remove(bot.user);
                botReactionForward.remove(bot.user);
              });
            }
          } else {
            const embed = new RichEmbed({
              description: lang.errors.noUser
            });
            msg.channel.send(embed);
          }
          break;
      }
    } catch (err) {
      bot.logger.error(JSON.stringify(err));
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 2,
    usage: ["inf search {user_id}"]
  }
);

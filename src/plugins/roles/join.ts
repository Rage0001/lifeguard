import { RichEmbed } from "discord.js";
import { Command } from "../Command";

export const command = new Command(
  "join",
  async (msg, args, bot, guildConfig) => {
    try {
      const lang = bot.langs["en-US"].commands.join;
      const guild = msg.guild;
      if (guildConfig) {
        if (guildConfig.roles) {
          const role = args.join(" ");
          if (!isNaN(parseInt(role, 10))) {
            const storedRole = guildConfig.roles.find(r => r.id === role);
            if (storedRole) {
              const guildRole = guild.roles.find(r => r.id === role);
              if (guildRole) {
                msg.member.addRole(guildRole);
              }
            } else {
              const errorEmbed = new RichEmbed({
                description: lang.errors.invalidRole
              });
              errorEmbed.setTimestamp();
              msg.channel.send(errorEmbed);
            }
          } else {
            const storedRole = guildConfig.roles.find(r => r.name === role);
            if (storedRole) {
              const guildRole = guild.roles.find(r => r.name === role);
              if (guildRole) {
                msg.member.addRole(guildRole);
              }
            } else {
              const errorEmbed = new RichEmbed({
                description: lang.errors.invalidRole
              });
              errorEmbed.setTimestamp();
              msg.channel.send(errorEmbed);
            }
          }
        } else {
          const errorEmbed = new RichEmbed({
            description: lang.errors.noRolesFound
          });
          errorEmbed.setTimestamp();
          msg.channel.send(errorEmbed);
        }
      }
    } catch (err) {
      bot.logger.error(JSON.stringify(err));
    }
  },
  {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["join"]
  }
);

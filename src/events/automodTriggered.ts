import {Event} from '@events/Event';
import {strFmt} from '@lifeguard/util/strFmt';

export const event = new Event(
  'automodTrigger',
  async (lifeguard, msg, reason) => {
    if (msg.guild) {
      const logChannels = await lifeguard.getLogChannels(
        msg.guild.id,
        event.name
      );
      logChannels.forEach(async modlog => {
        modlog.send(
          strFmt(
            ":hammer: **{user}**'s message ({msgID}) was deleted for `{reason}`.",
            {
              user: msg.member?.displayName ?? msg.author.tag,
              msgID: msg.id,
              reason: reason ?? 'No Reason Specified',
            }
          )
        );
      });
    }
  }
);

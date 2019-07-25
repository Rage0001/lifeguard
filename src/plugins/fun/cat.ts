import axios from "axios";
import { RichEmbed } from "discord.js";
import { Command } from "../Command";

export const command = new Command(
  "eval",
  async (msg, args, bot) => {
    const data = await axios.get(
      "https://api.thecatapi.com/v1/images/search?size=large&has_breeds=true"
    );
    const cat = data.data[0];

    const embed = new RichEmbed({
      description: cat.breeds[0].description,
      image: {
        url: cat.url
      },
      title: cat.breeds[0].name
    });
    msg.channel.send(embed);
  },
  {
    guildOnly: true,
    hidden: false,
    level: 0,
    usage: ["cat"]
  }
);
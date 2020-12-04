"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("discord-akairo");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class UnlockEmote extends discord_akairo_1.Command {
    constructor() {
        super("unlockemote", {
            aliases: ["unlockemote", "unlockemoji"],
            editable: false,
            typing: true,
            channel: "guild",
            category: "management",
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS", "MANAGE_CHANNELS"],
            userPermissions: ["MANAGE_EMOJIS", "MANAGE_ROLES"],
            description: {
                content: "Unlock an emote from the role emote integration",
                usage: "< emoji >"
            },
            args: [
                {
                    id: "emoji",
                    type: "emoji",
                    prompt: {
                        start: "What emote would you like to unlock?"
                    }
                }
            ]
        });
    }
    async exec(message, { emoji }) {
        /**
         * Checks
         */
        if (!(emoji.guild.id === message.guild?.id))
            return message.reply("I can't do anything with emotes from other servers");
        if (!emoji.roles)
            return message.reply("That emote isn't locked");
        /**
         * Embed Declarations
         */
        const confirm_embed = new discord_js_1.MessageEmbed()
            .setTitle("Are you sure you want to unlock that emote?(`y`/`n`)")
            .addField("Emoji:", emoji, true)
            .setFooter(`⚠️Warning⚠️\nThis will remove the emote to role integration completely and everyone will be able to use that emote regardless of their roles`)
            .setColor(message.guild.me?.displayHexColor || "#000000");
        const i_feel_like_god_today = new discord_js_1.MessageEmbed()
            .addField(`🔓Emote Unlocked🔓`, `${emoji} is now unlocked`)
            .setFooter(`Note: You might have to reload discord for changes to take place`);
        const i_knew_you_are_a_retard = new discord_js_1.MessageEmbed()
            .setDescription("😒 I was pretty sure you were going to cancel");
        /**
         * Confirmation
         */
        const confirmation = new Promise(async (resolve) => {
            await message.channel.send(confirm_embed);
            await message.channel.awaitMessages(m => m.author.id == message.author.id && ["y", "n", "yes", "no"].includes(m.content.toLowerCase()), {
                max: 1,
            })
                .then(collection => ["y", "yes"].includes(collection.first()?.cleanContent?.toLowerCase() ?? "") ? resolve(true) : resolve(false))
                .catch(() => resolve(false));
        });
        /**
         * Await Confirmation and execute result
         */
        if (await confirmation) {
            await emoji.roles.set([]);
            return message.channel.send(i_feel_like_god_today);
        }
        else {
            return message.channel.send(i_knew_you_are_a_retard);
        }
    }
}
exports.default = UnlockEmote;
//# sourceMappingURL=unlockemote.js.map
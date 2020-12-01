import 'discord-akairo'
import { Command } from 'discord-akairo'
import { GuildMember } from 'discord.js'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'

export default class Kick extends Command{
    public constructor() {
        super("kick", {
            aliases: ["kick"],
            editable: false,
            typing: true,
            channel: "guild",
            category: "moderation",
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
            description: {
                content: "Kick a member from the server",
                usage: "< member > [ reason ]"
            },
            args: [
                {
                    id: "member",
                    type: "member",
                    prompt: {
                        start: "What member would you like to kick?"
                    }
                },
                {
                    id: "reason",
                    match: "rest",
                    default: "No reason Provided!"
                }
            ]
        })
    }

    public async exec(message: Message, { member, reason }: { member: GuildMember, reason: string }) {
        /**
         * Constant Declarations
         */
        if (reason.length > 480) reason = `${reason.substring(0, 480)}...`

        /**
         * Embed Declarations
         */
        const udumbman = new MessageEmbed()
        .setDescription(`😅 ${member} You can't **Kick** yourself`)
        .setColor(message.member?.displayHexColor || message.guild!.me?.displayHexColor || "#000000")

        const wtfbro = new MessageEmbed()
        .setDescription(`😅 ${message.member} You can't **Kick** someone with an equal or higher role`)
        .setColor(message.member?.displayHexColor || message.guild!.me?.displayHexColor || "#000000")

        const whybullyme = new MessageEmbed()
        .setDescription(`😞 You can't Kick me with that command`)

        const learnhowtodiscordudumb = new MessageEmbed()
        .setDescription(`😠 ${message.member} You can't **Kick** the server owner`)
        .setColor(message.member?.displayHexColor || message.guild!.me?.displayHexColor || "#000000")

        const idkwhythatmemberisnotkickable = new MessageEmbed()
        .setDescription(`☺️ ${message.member} That member is not Kickable`)
        .setColor(message.member?.displayHexColor || message.guild!.me?.displayHexColor || "#000000")

        const ruhappynow = new MessageEmbed()
        .addField(`Done!`, `${message.member},\n${member} has now been Kicked!`)
        .setColor(message.member?.displayHexColor || message.guild!.me?.displayHexColor || "#000000")
        .addField(`Reason:`, reason)

        const unotjokingryt = new MessageEmbed()
        .setDescription(`${message.member}, Are you sure you want to **Kick** ${member.displayName}?(\`y\`/\`n\`)`)
        .addField(`Reason:`, reason)
        .setFooter(`⚠️Warning⚠️\nThey will not be able to rejoin the server again unless they get an invite`)

        const uretard = new MessageEmbed()
        .setDescription(`😒 I was pretty sure you were going to cancel`)

        /**
         * Checks
         */
        if (member && member === message.member) return message.channel.send(udumbman)
        if (member.roles.highest.position >= message.member!.roles.highest.position) return message.channel.send(wtfbro)
        if (member === message.guild!.owner) return message.channel.send(learnhowtodiscordudumb)
        if (member && member === message.guild!.me) return message.channel.send(whybullyme)
        if (!member.kickable) return message.channel.send(idkwhythatmemberisnotkickable)

        /**
         * Confitmation
         */
        const confirmation = new Promise(async resolve => { 
            await message.channel.send(unotjokingryt)
            await message.channel.awaitMessages(m => m.author.id == message.author.id && ["y", "n", "yes", "no"].includes(m.content.toLowerCase()), {
                max: 1,
            })
            .then(collection => ["y", "yes"].includes(collection.first()?.cleanContent?.toLowerCase() ?? "") ? resolve(true) : resolve(false))
            .catch(() => resolve(false))
        })

        /**
         * Possibly Cool Stuff
         */
        if (await confirmation) {

        await member.kick(`${message.member!.id}: ${reason}`)
        return message.channel.send(ruhappynow)

        } else {
            return message.channel.send(uretard)
        }

    }
}
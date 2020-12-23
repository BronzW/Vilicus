import { Channel } from 'discord.js'
import { User } from 'discord.js'
import { Message } from 'discord.js'
import { TextChannel } from 'discord.js'
import { MessageEmbed } from 'discord.js'

/**
 * Capitalize a string
 * @param {string} str
 */
function Capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * To Ordinal Number
 * @param {int} number
 */
function toOrdinal(int: number | string) {
    int = int.toString()
    if (int === '11' || int === '12' || int === '13') return int + 'th'
    if (int.endsWith('1')) return int + 'st'
    else if (int.endsWith('2')) return int + 'nd'
    else if (int.endsWith('3')) return int + 'rd'
    else return int + 'th'
}

/**
 * Choice is random from array (gave the name choice bc i am used to the python way)
 * @param {string[]} array
 */
function choice(array: string[]) {
    return array[Math.floor(Math.random() * array.length)]
}

/**
 * Random will give a random number (default is 1 to 100)(same case i am used to the python way)
 * @param {number} min
 * @param {number} max
 */
function random(min: number, max: number) {
    if (!min || !max) {
        min = 0
        max = 100
    }
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Removes Duplicate entries from array
 * @param {string[]} array
 */
function cleanArray(array: string[]) {
    return Array.from(new Set(array).values())
}

/**
 * Simple time conversion
 * @param {number} time
 */
function cleanTime(time: number) {
    const tt = [
        { n: 'd', s: 86400000 },
        { n: 'h', s: 3600000 },
        { n: 'm', s: 60000 },
        { n: 's', s: 1000 },
    ]
    const ctime = [Math.floor(time / tt[0].s).toString() + tt[0].n]
    for (let i = 0; i < 3; i++) {
        ctime.push(Math.floor((time % tt[i].s) / tt[i + 1].s).toString() + tt[i + 1].n)
    }
    return ctime.filter((g) => !g.startsWith('0')).join(', ')
}

function sendError(channel: TextChannel, error: string) {
    channel.send(new MessageEmbed().setColor('RED').setTitle('Error!').setDescription(error))
}

class Pageinator {
    message: Message
    items: any[]
    maxNumber: number
    func: (item: string) => string

    /**
     * Creates a paginator/pagination
     * @param {Channel} channel The channel which the paginator is sent in
     * @param {any[]} items The items that the paginator should display
     * @param {Function} func The function that will return a string that will be displayed in the embed. It should take in one argument, the item that will be processed.
     * @param {number} maxNumber The number of items that will be displayed in one page of the paginator. Defaults to 4.
     *
     * @example
     * new Paginator(message, ['Item 1', 'Item 2', 'Item 3', 'Item 4'], (item) => item, 2)
     */
    constructor(message: Message, items: any[], func: (item: string) => string, maxNumber: number = 4) {
        this.message = message
        this.items = items
        this.maxNumber = maxNumber
        this.func = func
        this.display(this.generate())
    }

    async display(embeds: any[]) {
        let currentPage = 0

        const pagemsg = (count: any) => `Page (${count + 1}/${embeds.length})`

        const embed = await this.message.channel.send(pagemsg(currentPage), embeds[currentPage])
        const reactions = ['⏪', '⬅️', '➡️', '⏩', '🗑️']
        for (let reaction of reactions) {
            embed.react(reaction)
        }

        const filter = (reaction: any, user: User) =>
            reactions.includes(reaction.emoji.name) && this.message.author.id === user.id

        const collector = embed.createReactionCollector(filter)

        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === reactions[0]) {
                // double left
                currentPage = 0
                embed.edit(pagemsg(currentPage), embeds[currentPage])
            } else if (reaction.emoji.name === reactions[1]) {
                // left
                if (currentPage != 0) {
                    --currentPage
                    embed.edit(pagemsg(currentPage), embeds[currentPage])
                }
            } else if (reaction.emoji.name === reactions[2]) {
                // right
                if (currentPage < embeds.length - 1) {
                    currentPage++
                    embed.edit(pagemsg(currentPage), embeds[currentPage])
                }
            } else if (reaction.emoji.name === reactions[3]) {
                // double right
                currentPage = embeds.length - 1
                embed.edit(pagemsg(currentPage), embeds[currentPage])
            } else if (reaction.emoji.name === reactions[4]) {
                // delete
                embed.delete()
                return
            }

            reaction.users.remove(user)
        })
    }

    generate(): any[] {
        const embeds = []
        let max = this.maxNumber
        let k = this.maxNumber

        for (let i = 0; i < this.items.length; i += max) {
            const current = this.items.slice(i, k)
            k += max

            const display = current.map((item) => this.func(item)).join('\n')
            const embed = new MessageEmbed().setDescription(display)

            embeds.push(embed)
        }

        return embeds
    }
}

const fn = {
    Capitalize,
    toOrdinal,
    choice,
    random,
    cleanArray,
    cleanTime,
    Pageinator,
}

export default fn

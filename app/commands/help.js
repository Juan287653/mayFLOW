const pagination = require('discord.js-pagination');
const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "The help command, what do you expect?",

    async run (client, message, args){

        //Sort your commands into categories, and make seperate embeds for each category

        const moderation = new Discord.MessageEmbed()
        .setTitle('Moderation')
        .addField('`>mute`', 'Mutes a member for a certain amount of time.')
        .addField('`>clear`', 'Purges messages')
        .setTimestamp()

        const fun = new Discord.MessageEmbed()
        .setTitle('Fun')
        .addField('`>meme`', 'Generates a random meme')
        .addField('`>ascii`', 'Converts text into ascii')
        .addField('`>rpc`', 'Play rock paper sciscors with an opponent or against the bot')
        .addField('`>hug`', 'Hug someone!')
        .addField('`>setstatus`', 'Sets the bots status')
        .setTimestamp()

        const utility = new Discord.MessageEmbed()
        .setTitle('Utlity')
        .addField('`>weather`', 'Checks weather forecast for provided location')
        .setTimestamp()

        const music = new Discord.MessageEmbed()
        .setTitle('Music')
        .addField('`>play`', 'Plays a song with a search result')
        .addField('`>skip`', 'Skips the song and plays the next one in queue')
        .addField('`>queue`', 'Shows the current queue of songs')
        .addField('`>filter`', 'Applies a certain filter to the song')
        .addField('`>filters`', 'Shows all the possible filters')
        .addField('`>stop`', 'Stops the current playing song')
        .setTimestamp()

        const giveaway = new Discord.MessageEmbed()
        .setTitle('Giveaway')
        .addField('`>giveaway`', 'Creates a giveaway')
        .addField('`>reroll [id]`', 'Rerolls the giveaway')
        .setTimestamp()

        const enxquity = new Discord.MessageEmbed()
        .setTitle('Enxquity Only')
        .addField('`>forcehug`', 'Forces two people to hug')
        .addField('`>gb`', 'Forces a gang bang to happen.. somehow.')
        .setTimestamp()

        const keys = new Discord.MessageEmbed()
        .setTitle('Keys')
        .addField('`>create`', 'Creates a key')
        .addField('`>keys`', 'Shows all available keys')
        .addField('`>status`', 'Returns the status of the key')
        .addField('`>blacklist`', 'Blacklists the key so it cannot be used ever again')
        .addField('`>unblacklist`', 'Unblacklists a key')
        .addField('`>redeeem`', 'Allows the user to redeem a valid key to gain a whitelist')
        .addField('`>delete`', 'Deletes a key from the database')
        .setTimestamp()

        const pages = [
                moderation,
                fun,
                utility,
                music,
                giveaway,
                enxquity,
                keys
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)
    }
}
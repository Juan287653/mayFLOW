const Commando = require('discord.js-commando')
const Discord = require('discord.js');

module.exports = {
    name: "info",
    description: "Tells you info about the user.",

    async run (client, message, args){
        console.log("ran")

        const user = message.mentions.users.first() || message.member.user
        const member = message.guild.members.cache.get(user.id)

        console.log(member)

        const embed = new Discord.MessageEmbed()
        .setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
        .addFields(
            {
            name: 'User tag',
            value: user.tag,
            },
            {
            name: 'Is bot',
            value: user.bot,
            },
            {
            name: 'Nickname',
            value: member.nickname || 'None',
            },
            {
            name: 'Joined Server',
            value: new Date(member.joinedTimestamp).toLocaleDateString(),
            },
            {
            name: 'Joined Discord',
            value: new Date(user.createdTimestamp).toLocaleDateString(),
            },
            {
            name: 'Roles',
            value: member.roles.cache.size - 1,
            }
        )

        message.channel.send(embed)
    }
}
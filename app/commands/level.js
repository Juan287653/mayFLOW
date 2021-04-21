const levels = require("./data/levels.json")
const fs = require("fs-extra");
const Discord = require('discord.js');

module.exports = {
    name: "level",
    description: "Tells you your level",

    async run (client, message, args){
        if (!levels[message.author.id]) {
            levels[message.author.id] = {
                "Level": 1,
                "XP": 0,
                "MaxXP": 100
            }
            fs.writeFile("commands/data/levels.json", JSON.stringify (levels, null, 4), err => {
                if (err) throw err;
            });
        }

        let plr = message.mentions.members.first();

        if (!plr) {
        const levelInfo = new Discord.MessageEmbed()
        .setTitle("Level Card")
        .setColor("GREEN")
        .addField("Level: ", levels[message.author.id].Level)
        .addField("XP: ", levels[message.author.id].XP+"/"+levels[message.author.id].MaxXP)

        message.channel.send(levelInfo);
        } else {
            if (!levels[plr.id]) {
                levels[plr.id] = {
                    "Level": 1,
                    "XP": 0,
                    "MaxXP": 100
                }
                fs.writeFile("commands/data/levels.json", JSON.stringify (levels, null, 4), err => {
                    if (err) throw err;
                });
            }

            const levelInfo = new Discord.MessageEmbed()
            .setTitle("Level Card")
            .setColor("GREEN")
            .addField("Level: ", levels[plr.id].Level)
            .addField("XP: ", levels[plr.id].XP+"/"+levels[plr.id].MaxXP)
    
            message.channel.send(levelInfo);  
        }

    }
}
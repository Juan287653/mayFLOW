const TOKEN = "ODMwMDg1NTExNjkwNTg0MDc0.YHBjYA.h0azjQTXlKw7rWxmd1ywQk_eipI";
const Discord = require("discord.js");
const bot = new Discord.Client();
const PREFIX = ">";
const fs = require("fs-extra");
const ms = require("ms");

bot.keys = require ("./keys.json")

const { readdirSync } = require('fs');

const { join } = require('path');

const distube = require('distube');

const player = new distube(bot);

const levels = require("./commands/data/levels.json")

const config = require('./config.json');
bot.config = config;

const { GiveawaysManager } = require('discord-giveaways');

player.on('playSong', (message, queue, song) => {
  message.channel.send(`${song.name} has started playing!`)
})

bot.player = player

bot.on("ready", async => {
  console.log("Online");
});

bot.giveawaysManager = new GiveawaysManager(bot, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

bot.commands= new Discord.Collection();

const prefix = PREFIX;
//You can change the prefix if you like. It doesn't have to be ! or ;
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    bot.commands.set(command.name, command);
}


bot.on("error", console.error);

let stats = {
    serverID: '828796399696347146',
    total: "830199811034054666",
    member: "830199827206766602",
    bots: "830199851693637682"
}

bot.on('guildMemberAdd', member => {
    if(member.guild.id != stats.serverID) return;
    bot.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
    bot.channels.cache.get(stats.member).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    bot.channels.cache.get(stats.bots).setName(`Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`);
})

bot.on('guildMemberRemove', member => {
    if(member.guild.id != stats.serverID) return;
    bot.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
    bot.channels.cache.get(stats.member).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    bot.channels.cache.get(stats.bots).setName(`Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`);
})

bot.xpPerMessage = 3
bot.xpAddOn = 50

bot.on("message", async message => {
  if (message.content.split(PREFIX.length+"level".length) != PREFIX + "level") {
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
    levels[message.author.id].XP += bot.xpPerMessage
    if (levels[message.author.id].XP >= levels[message.author.id].MaxXP) {
      var left = (levels[message.author.id].MaxXP-levels[message.author.id].XP)
      levels[message.author.id].XP = left & 0;
      levels[message.author.id].MaxXP += bot.xpAddOn
      levels[message.author.id].Level += 1
      message.reply("You have leveled up to level " + levels[message.author.id].Level + ".")
    }
    fs.writeFile("commands/data/levels.json", JSON.stringify (levels, null, 4), err => {
      if (err) throw err;
    });
  }
});

bot.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const command = args.shift().toLowerCase();

        if(!bot.commands.has(command)) return;


        try {
            bot.commands.get(command).run(bot, message, args);

        } catch (error){
            console.error(error);
        }
    }
})

bot.on("message", function(message) {
  if (message.channel.type === "dm") {
    if (message.author.bot) return;
  }
  if (message.author.equals(bot.user)) return;

  if (!message.content.startsWith(PREFIX)) return;

  var args = message.content.substring(PREFIX.length).split(" ");

  switch (args[0].toLowerCase()) {
      
    case "filters":

    message.channel.send("**3d**, **echo**, **karaoke**, **nightcore**, **vaporwave**");

    break

    case "create":
      var key = message.content.slice(7);
      
      if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You lack administrative permissions.");
      
      if (key) {
        if (!bot.keys["Valid"][key]) {
          if (!bot.keys["Blacklisted"][key]) {
            bot.keys["Valid"][key] = {
              "Used": false,
              "Owner": ""
            }
            fs.writeFile("./keys.json", JSON.stringify (bot.keys, null, 4), err => {
                if (err) throw err;
                message.reply("Added key successfully.")
            });
          } else {
            message.reply("You cannot create a blacklisted key.")
          }
        }else {
          message.channel.send("This key already exists.")
        }
      }else {
        message.channel.send("No key was specified.")
      }
      
      break;
      
    case "status":
      
      if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You lack administrative permissions.");
      
      var keyStr = message.content.slice(7);
      let _key2 = bot.keys["Valid"][keyStr]
      if (_key2) {
        if (_key2.Used == false) {
          message.channel.send("The key has not been used.")
        } else {
          message.channel.send("The key has been used.")
        }
      } else {
       message.channel.send("The key was not found.")  
      }
    break;
      
    case "redeem":
    var keyStr = message.content.slice(7);
    if(!message.member.roles.cache.some(role => role.name === 'Whitelisted')) {
    if (keyStr) {
      var _key = bot.keys["Valid"][keyStr]
      var _blacklisted = bot.keys["Blacklisted"][keyStr]
      if (_blacklisted) {
          message.channel.send("That key is blacklisted - Reason: " + _blacklisted.Reason)
        } else if (_key) {
        if (_key.Used == false) {
        var user = message.member
        let whitelisted = message.guild.roles.cache.find(role => role.name === "Whitelisted");
        if (whitelisted) {
          user.roles.add(whitelisted.id);
          var owner = user.id
          message.reply("You have been whitelisted! - Key is now binded to User ID " + owner)
          bot.keys["Valid"][keyStr] = {
            "Used": true,
            "Owner": owner
          }
          fs.writeFile("./keys.json", JSON.stringify(bot.keys, null, 4), (err) => {
            if (err) console.log(err);
          });
        }else {
          message.channel.send("Couldn't find role named 'Whitelisted'")
        }}else {
          message.channel.send("That key has already been used")
        }
      }else {
        message.channel.send("Invalid key.")
      }
      
    }else{
      message.reply("Provide a key.")
    }
  }else {
    message.reply("You already have a key redeemed.")
  }
    
    break;
      
    case "keys":
      
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You lack administrative permissions.");
      
    var readFile = fs.readFileSync('./keys.json', 'utf8');
    message.reply(readFile);
      
    break;
      
    case "blacklist":
    
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You lack administrative permissions.");
      
    var key = message.content.slice(10)
    
    if (bot.keys["Valid"][key]) {
      bot.keys["Blacklisted"][key] = {
        "Reason": null
      }
      
      var guild = message.guild
      var member = guild.members.cache.get(bot.keys["Valid"][key].Owner)
      let whitelisted = message.guild.roles.cache.find(role => role.name === "Whitelisted");
      
        member.roles.remove(whitelisted);
      
      delete bot.keys["Valid"][key]
      
      fs.writeFile("./keys.json", JSON.stringify (bot.keys, null, 4), err => {
          if (err) throw err;
          message.reply("Blacklisted key successfully.")
      });
    } else if (bot.keys["Blacklisted"][key]) {
      message.channel.send("This key is already blacklisted")
    }else {
      message.channel.send("Invalid key!")
    }
      
    break;

    case "unblacklist":
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You lack administrative permissions.");
    let possibleKey = message.content.slice(12)
    if (!possibleKey) return message.reply("Provide a key.")
    if (bot.keys["Blacklisted"][possibleKey]) {
      delete bot.keys["Blacklisted"][possibleKey]
      fs.writeFile("./keys.json", JSON.stringify (bot.keys, null, 4), err => {
        if (err) throw err;
        message.channel.send("Key succesfully unblacklisted; use >create to re-add the key to the database if needed.")
      });
    }else {
      message.reply("That is not a blacklisted key.")
    }
    break;
      
    case "delete":
    
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You lack administrative permissions.");
    
    var keyStr2 = message.content.slice(7)
    let key_ = bot.keys["Valid"][keyStr2]
    
    if (keyStr2) {
      if (key_) {          
        if (bot.keys["Valid"][keyStr2].Owner != "") {
          var guild = message.guild
          var member = guild.members.cache.get(bot.keys["Valid"][keyStr2].Owner)
          let whitelisted = message.guild.roles.cache.find(role => role.name === "Whitelisted");

           member.roles.remove(whitelisted);

          message.channel.send("Sucessfully removed whitelisted role from " + bot.keys["Valid"][keyStr2].Owner + " (" +  member.tag + ")" + " due to being previous owner of key.")
        }
          
       delete bot.keys["Valid"][keyStr2]
       fs.writeFile("./keys.json", JSON.stringify(bot.keys, null, 4), (err) => {
          if (err) console.log(err);
          message.channel.send("Removed key succesfully.")
        });
      }else{
        message.channel.send("Invalid key.")
      }
    }else{
      message.channel.send("Provide a key.") 
    }
    
      
    break;
      
      
    case "mute":
      if (message.channel.type === "dm") return
    
	    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You do not have administrator;therefore, you will not be able to use this command.");
	    let muteMember = message.mentions.members.first();
	    if(!muteMember) return message.reply("No user was found, please try again {USAGE {?mute @member {time}}");
	    if(muteMember.hasPermission("ADMINISTRATOR")) return message.reply("The user you have tried to mute is a administrator and cannot be muted.")
	    let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");
	    if(!muteRole) return message.reply("The role named 'Muted' was undefined, Please create the role and try again.");
	    let params =  message.content.split(" ").slice(1);
	    let time = params[1];
  	  if (!time) return message.reply(`***${message.content}***, Incorrect usage. Missing time {USAGE {?mute @member {time}}`);
	
	  muteMember.roles.add(muteRole.id);
  	message.channel.send(`Oh no, You have been muted for ${ms(ms(time), {long:true})} @${muteMember.user.tag}`);
	
	  setTimeout(function() {
	  	muteMember.roles.remove(muteRole.id);
		  message.channel.send(`@${muteMember.user.tag}, You have been unmuted, the mute lasted : ${ms(ms(time), {long:true})}`)
	  }, ms(time));
	  break
      
    case "setstatus":
    if(!message.member.hasPermission(`ADMINISTRATOR`)) return message.channel.send("Your not a admin;therefore, the request to setstaus was undone.");
    let slicedmessagert = message.content.slice(11);
    bot.user.setActivity(slicedmessagert);
    message.channel.send(`:white_check_mark: Successfully set status to '${slicedmessagert}'. :white_check_mark:`);
    break 
      
    case "hug":
    let hMember = message.mentions.members.first();
    if(!hMember) return message.channel.send(`${message.member.user} has recieved the badge of weirdness since he hugged himself! Well done ${message.member.user}!`);
    if(hMember) return message.channel.send(`Awwww, How cute, ${message.member.user} has hugged ${hMember.user} ❤️❤️❤️`) & message.react("💔");
    break;
      
    case "forcehug":
    if (message.member.id != 398559841020411904) return message.channel.send("lol ur gay bitch")
        
    const [first, second] = message.mentions.users.keyArray();

    if (!first || !second)
     return message.channel.send('You need to mention two users!');
      
    var firstMember = message.guild.members.cache.get(first)
    var secondMember = message.guild.members.cache.get(second)
      
    message.channel.send(`Awwww, How cute, ${firstMember.user} has hugged ${secondMember.user} ❤️❤️❤️`) & message.react("💔");
    break;
      
    case "gb":
    if (message.member.id != 398559841020411904) return message.channel.send("lol ur gay bitch")
    const [f, s] = message.mentions.users.keyArray();

    if (!f || !s)
     return message.channel.send('You need to mention two users!');
      
    var fM = message.guild.members.cache.get(f)
    var sM = message.guild.members.cache.get(s)
    
    message.channel.send(`${fM.user} and ${sM.user} have just had a major gang bang! holy fuck.`)
    
    break
      
    case "rpc":
    let choices = [
      'rock',
      'paper',
      'scissors'
      ]
    let fetched = choices[Math.floor(Math.random() * choices.length)];
    message.reply(`You got ${fetched}!`);
    let fetched2 = choices[Math.floor(Math.random() * choices.length)];
    message.reply(`And your opponent got ${fetched2}!`)
    break
  }
});

bot.login(TOKEN);

module.exports = {
    name: "volume",
    description: "Changes the volume of the music",

    async run  (client, message, args) {
        if(!message.member.voice.channel) return message.channel.send("please join a voice channel first!");

        let vol = args.join(" ");

        if(!vol) return message.channel.send('Please provide a volume value');

        
    }
}
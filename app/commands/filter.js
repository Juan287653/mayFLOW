module.exports = {
    name: "filter",
    description: "Adds a filter to your music!",

    async run  (client, message, args) {
        if(!message.member.voice.channel) return message.channel.send("please join a voice channel first!");

        let filter = args.join(" ");

        if(!filter) return message.channel.send('Please provide a filter');

        let filtera = client.player.setFilter(message, filter);
        message.channel.send(`:musical_note: **⁓ Added filter: **
        > ` + (filtera || "off"));
    }
}
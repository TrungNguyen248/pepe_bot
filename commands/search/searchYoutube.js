require('dotenv').config();
const {SlashCommandBuilder} = require("discord.js");

const { google } = require('googleapis');

// Xác thực với API bằng cách sử dụng khóa API của bạn
const yt_api_key =  process.env.YOUTUBE_API_KEY;
const youtube = google.youtube({
  version: 'v3',
  auth: yt_api_key
});

// Tìm kiếm video trên YouTube
const search = async function(query) {
    try{
        const response = 
        await youtube.search.list({
            q: query,
            part: 'id',
            maxResults: 1
        })
        
        const items = response.data.items;
        if (items && items.length > 0) {
            const videoId = items[0].id.videoId;
            videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }
        console.log(videoUrl);
        return videoUrl;
    } catch (err){
        console.error('Error searching for video:', err);
    };
}

/* search("mùa hạ đi qua"); */
    
module.exports = {
    data: new SlashCommandBuilder()
        .setName("youtube")
        .setDescription('Tìm kiếm Youtube!')
        .addStringOption(option =>
					option
						.setName('search')
						.setDescription('Tìm kiếm trên Youtube')
						.setRequired(true)
				),
    async execute(interaction) {
        await interaction.reply("Đang tìm kiếm");
        const result = await search(interaction.options.getString('search'));
        await interaction.editReply(`Kết quả tìm kiếm: ${result}`);
    }
}

require('dotenv').config();
const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder} = require("discord.js");

const { google } = require('googleapis');

// Xác thực với API
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
            part: 'snippet',
            maxResults: 5
        })
        
        const items = response.data.items;
       /* console.log(items[0]); */
        
        let choices = [];

        items.forEach(item => {
          choices.push({
                label: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                value: item.id.videoId
            });
        });

        return choices;
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
       /*  await interaction.reply("Đang tìm kiếm");
        const result = await search(interaction.options.getString('search'));
        await interaction.editReply(`Kết quả tìm kiếm: ${result}`); */
        
        await interaction.deferReply({ ephemeral: true });
        const results = await search(interaction.options.getString('search'));

        const menuOptions = results.map(result => ({
            label: result.label,
            channelTitle: result.channelTitle,
            value: result.value
        }));

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('youtube_results')
                    .setPlaceholder('Chọn một kết quả...')
                    .addOptions(menuOptions)
            );

        await interaction.editReply({
            content: 'Dưới đây là kết quả tìm kiếm:',
            components: [row]
        });

        const filter = (interaction) => interaction.customId === 'youtube_results';
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 30000 });

        collector.on('collect', async (interaction) => {
            const selectedValue = interaction.values[0];

            // Truy xuất đến kết quả tương ứng với giá trị được chọn
            const selectedResult = results.find(result => result.value === selectedValue);

            if (selectedResult) {
                const videoUrl = `https://www.youtube.com/watch?v=${selectedResult.value}`;
                await interaction.reply(`Kết quả tìm kiếm:\n\nTitle: ${selectedResult.label}\nKênh: ${selectedResult.channelTitle}\nLink: ${videoUrl}`);
            } else {
                await interaction.reply('Không tìm thấy kết quả.');
            }
        });
    }
}


require('dotenv').config();

const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const axios = require('axios');

const data_agent_json_vi = process.env.DATA_AGENT_JSON_VI;    


const getAllChampions = async function(nameAgent) {
    try{
        const res = await axios.get(data_agent_json_vi);
        const agents = res.data.result.data.allContentstackAgentList.nodes[0].agent_list;
        let result = null;

        /* console.log(agents); */
        agents.forEach((agent, index, agents) => {
            agent_name = agent.related_content[0].machine_name
            if(agent_name === nameAgent.toLowerCase()) {
                result = agents[index]
                return;
            }

        })
        return result;
    }catch(err) {
        console.error(err);
    }
}
/* getAllChampions("gekko"); */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vals')
        .setDescription('Tìm kiếm thông tin đặc vụ')
        .addStringOption(option => 
            option
                .setName('search')
                .setDescription('Nhập tên đặc vụ')
                .setRequired(true)
        ),
        async execute(interaction) {
            await interaction.reply("Đang tìm kiếm...")
            const searchQuery = interaction.options.getString('search')
            if(searchQuery.length < 3) {
                await interaction.editReply("Phải nhập tối thiểu 3 kí tự để tìm kiếm dễ dàng hơn")
            } else {
                const result = await getAllChampions(searchQuery)
                if(result) {
                    await interaction.editReply("Kết quả tìm thấy:")
                    const infoEmbed  = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(`Thông tin về đặc vụ '${result.related_content[0].title}'`)
                        .setAuthor({ name: result.related_content[0].title, iconURL:null, url: null})
                        .setDescription(result.description)
                        .setThumbnail(result.role_icon.url)
                        .setImage(result.agent_image.url)
                        .addFields(
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Chiêu 1', value: result.abilities[0].ability_name, inline: true },
                            { name: 'Chiêu 2', value: result.abilities[1].ability_name, inline: true },
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Chiêu 3', value: result.abilities[2].ability_name, inline: true },
                            { name: 'Chiêu 4', value: result.abilities[3].ability_name, inline: true },
                        )
                        await interaction.editReply({ embeds: [infoEmbed] })

                        for(let i = 0; i < 4; i++) {
                            await interaction.followUp(`Chiêu ${i+1}: ....`);
                            const infoEmbed_ability  = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`Chiêu ${i+1}: ${result.abilities[i].ability_name}`)
                                .setAuthor({ name: "Nhấp vào để xem video mô tả!", iconURL:result.agent_image.url, url: result.abilities[i].ability_video[0].video.file.url})
                                .setDescription(result.abilities[i].ability_description)
                                .setThumbnail(result.abilities[i].ability_icon.url)
                                .setImage(result.abilities[i].ability_video[0].static_image.url)
                            await interaction.followUp({ embeds: [infoEmbed_ability] })
                            }
                    /* await interaction.editReply(`Thông tin cho đặc vụ '${searchQuery}' là :
    Name: ${result.related_content[0].title}
    Role: ${result.role}  ${result.role_icon.url}
    Abilities : ..
    Image: ${result.agent_image.url} 
                    `) //tab ảnh hưởng đến cấu trúc message */
                } else {
                    await interaction.editReply(`Không tìm thấy thông tin cho '${searchQuery}'`)
                }
            }
        }
}
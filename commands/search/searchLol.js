require('dotenv').config();

const {SlashCommandBuilder} = require("discord.js");
const axios = require('axios');

const data_champion_json_en = process.env.DATA_CHAMPION_JSON_EN;


const getAllChampions = async function(nameChampion) {
    try{
        const res = await axios.get(data_champion_json_en);
        const champions = res.data.result.data.allChampions.edges;
        let result = null;
        const roles = ['Fighter', 'Mage', 'Assassin', 'Tank']

        champions.forEach((champion) => {
            champion_name = champion.node.champion_name
            if(champion_name.toLowerCase() === nameChampion.toLowerCase()) {
                const char = "*"
                let difficultyText = ""
                for(let i = 0; i < champion.node.difficulty; i++) {
                    difficultyText+=char
                }
                champion.node.difficulty = difficultyText
                result = champion.node
                /* console.log(result); */

                return;
            }
            if(champion_name.toLowerCase().includes(nameChampion.toLowerCase())) {
                
              /*   result.push(champion.node.champion_name) */
                console.log(result)
            }

        })
       /*  console.log(typeof result) */
        return result;
    }catch(err) {
        console.error(err);
    }
}
/* getAllChampions("jax") */

//res.data.result.data.allChampions.edges.node =>publish_details: [Object],
// uid: 'blt6cc86a1f51f2804c',
// url: '/champions/rek-sai/',
// champion_name: "Rek'Sai",
// champion_splash: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/RekSai_0.jpg',
// recommended_roles: [Array],
// difficulty: 3,
// champion: [Object]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lols')
        .setDescription('Tìm kiếm thông tin tướng')
        .addStringOption(option => 
            option
                .setName('search')
                .setDescription('Nhập tên tướng')
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
                    await interaction.editReply(`Thông tin cho tướng '${searchQuery}' là :
    Name: ${result.champion_name}
    Roles: ${result.recommended_roles[0]}, ${result.recommended_roles[1]}
    Difficulty: ${result.difficulty}
    Image: ${result.champion_splash} 
                    `) //tab ảnh hưởng đến cấu trúc message
                } else {
                    await interaction.editReply(`Không tìm thấy thông tin cho '${searchQuery}'`)
                }
            }
        }
}
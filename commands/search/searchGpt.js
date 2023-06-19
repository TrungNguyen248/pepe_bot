require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: "org-XSU0WvNvIKvnCytkvzk0OXSx",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const start = async function (text_input) {
	const completion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages : [{
			role: "user",
			content : text_input
		}]
	})
	return completion.data.choices[0].message["content"];
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Bạn hỏi Pepe trả lời!')
		.addStringOption(option =>
					option
						.setName('search')
						.setDescription('Tìm kiếm với Pepe')
						.setRequired(true)
				),
	async execute(interaction) {
		await interaction.reply('Pepe đang nghĩ: ....');
		const result = await start(interaction.options.getString('search'));
		await interaction.editReply(`Pepe trả lời: ${result}`);

		//await interaction.followUp('Pong again!'); 
		//await interaction.followUp(locales[interaction.locale] ?? 'Hello World (default is english)');
	},
};

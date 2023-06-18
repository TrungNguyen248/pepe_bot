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

const locales = {
	pl: 'Witaj Świecie!',
	de: 'Hallo Welt!',
	vi: "Xin chào "
}; //gửi message theo locale

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Bạn hỏi Pepe trả lời!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('show')
				.setDescription('Show a message')
				.addStringOption(option =>
					option.setName('search')
						.setDescription('The message to show')
						.setRequired(true)
				)
		),
	async execute(interaction) {
		
		if(interaction.options.getSubcommand() === 'show') {
			await interaction.reply('Pepe đang nghĩ: ....');
			const result = await start(interaction.options.getString('search'));
			await interaction.editReply(`Pepe trả lời: ${result}`);
		} 

		//await interaction.followUp('Pong again!'); 
		//await interaction.followUp(locales[interaction.locale] ?? 'Hello World (default is english)');
	},
};

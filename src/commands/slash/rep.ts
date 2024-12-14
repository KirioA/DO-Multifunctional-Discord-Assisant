import { ApplicationCommandOptionType, TextInputStyle } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'rep',
	description: 'Отправить сообщение разработчикам.',

	options: [],
	defaultPermission: true,

	run: async (client, interaction) => {
		const modal = {
			title: 'Форма обратной связи ',
			custom_id: 'report',
			components: [{
				type: 1,
				components: [{
					type: 4,
					custom_id: 'embedDescription',
					label: 'Сообщение',
					style: TextInputStyle.Paragraph,
					min_length: 1,
					max_length: 1000,
					placeholder: 'Опишите проблему или поделитесь своми мыслями.',
					required: true
				}]
			}]
		};

		await interaction.showModal(modal);

		const submitted = await interaction.awaitModalSubmit({
			time: 600000,
			filter: (i: any) => i.user.id === interaction.user.id
		}).catch(console.error);

		if (submitted) {
			const inputDescription = submitted.fields.getTextInputValue('embedDescription');

			const developer = await client.users.fetch(bot.adminId);
			const embed = {
				color: 0xffffff,
				title: 'NEW REPORT',
				footer: {
					text: `GUILD: ${interaction.guild.id} | USER: ${interaction.user.tag}`,
				},
				description: inputDescription
			};

			await developer.send({ embeds: [embed] });

			await submitted.reply('Сообщение успешно отправлено!');
		}
	}
};

export default cmd;
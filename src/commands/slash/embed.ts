import { ApplicationCommandOptionType, TextInputStyle } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'embed',
	description: 'Создание оформленных окон.',

	options: [{
		name: 'channel',
		description: 'Канал публикации',
		type: ApplicationCommandOptionType.Channel,
		required: true
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;

		const channel = await interaction.options.getChannel('channel');
		if (!channel.permissionsFor(client.user).has('ViewChannel')) {
			sendEmbed.error(interaction, `Бот не имеет доступа к каналу ${channel}`);
			return;
		}

		const modal = {
			title: 'Создание embed-сообщения',
			custom_id: 'createEmbed',
			components: [{
				type: 1, // Action Row
				components: [{
					type: 4,
					custom_id: 'embedTitle',
					label: 'Заголовок',
					style: TextInputStyle.Short,
					min_length: 1,
					max_length: 30,
					placeholder: '',
					required: false
				}]
			}, {
				type: 1, // Action Row
				components: [{
					type: 4,
					custom_id: 'embedColor',
					label: 'Цвет',
					style: TextInputStyle.Short,
					min_length: 6,
					max_length: 6,
					placeholder: 'FFFF00',
					required: false
				}]
			}, {
				type: 1, // Action Row
				components: [{
					type: 4,
					custom_id: 'embedDescription',
					label: 'Сообщение',
					style: TextInputStyle.Paragraph,
					min_length: 1,
					max_length: 1000,
					placeholder: '',
					required: false
				}]
			}, {
				type: 1, // Action Row
				components: [{
					type: 4,
					custom_id: 'embedImage',
					label: 'Изображение',
					style: TextInputStyle.Short,
					min_length: 1,
					max_length: 100,
					placeholder: 'URL',
					required: false
				}]
			}, {
				type: 1, // Action Row
				components: [{
					type: 4,
					custom_id: 'embedFooter',
					label: 'Футер, нижняя строка',
					style: TextInputStyle.Short,
					min_length: 1,
					max_length: 15,
					placeholder: '',
					required: false
				}]
			}]
		};

		await interaction.showModal(modal);

		const submitted = await interaction.awaitModalSubmit({
			time: 600000,
			filter: (i: any) => i.user.id === interaction.user.id
		}).catch(console.error);

		if (submitted) {
			const inputTitle = submitted.fields.getTextInputValue('embedTitle');
			const inputColor = submitted.fields.getTextInputValue('embedColor');
			const inputDescription = submitted.fields.getTextInputValue('embedDescription');
			const inputImage = submitted.fields.getTextInputValue('embedImage');
			const inputFooter = submitted.fields.getTextInputValue('embedFooter');

			const createdEmbed = {
				author: {
					name: interaction.member.displayName,
					icon_url: interaction.user.displayAvatarURL()
				},
				color: inputColor ? +`0x${inputColor}` : client.color,
				title: inputTitle,
				description: inputDescription,
				image: { url: inputImage },
				footer: { text: inputFooter }
			};

			await submitted.reply(`Сообщение успешно создано и опубликовано в канале ${channel}`);
			await channel.send({ embeds: [createdEmbed] }).catch(console.error);
		}
	}
};

export default cmd;
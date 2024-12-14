import {
	ActionRowBuilder,
	ApplicationCommandType, ComponentType,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder
} from 'discord.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import translate from 'translatte';
import { MenuCommand } from '../../types.js';

/*
 * if the "translatte" package stops working, alternative is:
 * https://www.npmjs.com/package/google-translate-api
 * https://github.com/matheuss/google-translate-api
 */

const languages = {
	EN: { label: 'Английский', emoji: '🇬🇧' },
	AR: { label: 'Арабский', emoji: '🇦🇪' },
	ES: { label: 'Испанский', emoji: '🇪🇸' },
	IT: { label: 'Итальянский', emoji: '🇮🇹' },
	ZH: { label: 'Китайский', emoji: '🇨🇳' },
	DE: { label: 'Немецкий', emoji: '🇩🇪' },
	PL: { label: 'Польский', emoji: '🇵🇱' },
	PT: { label: 'Португальский', emoji: '🇵🇹' },
	RO: { label: 'Румынский', emoji: '🇷🇴' },
	RU: { label: 'Русский', emoji: '🇷🇺' },
	TR: { label: 'Турецкий', emoji: '🇹🇷' },
	UK: { label: 'Украинский', emoji: '🇺🇦' },
	FR: { label: 'Французский', emoji: '🇫🇷' },
	JA: { label: 'Японский', emoji: '🇯🇵' }
};

const cmd: MenuCommand = {
	name: 'Перевести сообщение',
	type: ApplicationCommandType.Message,

	run: async (client, interaction) => {
		try {
			const mainMessage = await interaction.channel.messages.fetch(interaction.targetId);

			const langOptions = Object.keys(languages)
				.map((key) => (
					new StringSelectMenuOptionBuilder()
						.setLabel(languages[key].label)
						.setValue(key)
						.setEmoji(languages[key].emoji)
				));

			const select = new StringSelectMenuBuilder()
				.setCustomId('translate')
				.setPlaceholder('Выберите конечный язык')
				.addOptions(langOptions);

			const row = new ActionRowBuilder()
				.addComponents(select);

			const message = await interaction.reply({
				components: [row],
				ephemeral: true
			});

			const collectorFilter = (i) => {
				i.deferUpdate();
				return i.user.id === interaction.user.id;
			};

			message.awaitMessageComponent({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 300000 })
				.then(async (i) => {
					if (i.user.id !== interaction.user.id) return;
					if (!languages[i.values[0]]) return;

					const res = await translate(mainMessage.content, { to: i.values[0] });
					await message.edit({ content: `*Переведено:*\n${res.text}`, components: [] });
				});
		} catch (e) {
			console.error(e);
			await interaction.reply(`Произошла ошибка ${e.code}, свяжитесь с разработчиком.`).catch(() => {
				interaction.editReply(`Произошла ошибка ${e.code}, свяжитесь с разработчиком.`);
			});
		}
	}
};

export default cmd;
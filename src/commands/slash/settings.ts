import {
	ActionRowBuilder,
	ButtonBuilder,
	ChannelSelectMenuBuilder,
	ButtonStyle,
	RoleSelectMenuBuilder,
	ChannelType,
	GuildChannel,
	TextChannel
} from 'discord.js';

import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

let current_page = 0;

const cmd: SlashCommand = {
	name: 'settings',
	description: 'Настройки.',

	options: [],
	defaultPermission: true,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;

		const MemGuild = await DB.getGuild(interaction.guild);
		const channel_join = await client.channels.cache.get(MemGuild.system_join.channel_join) as GuildChannel ?? null;
		const role_join = await interaction.guild.roles.cache.get(MemGuild.system_join.role_join) ?? null;

		const gpt_channel = await client.channels.cache.get(MemGuild.system_gpt.channel) as GuildChannel ?? null;

		const settings_pages = [
			{
				lable: '## 1/2 • Приветствие',
				state: 'state_join',
				state_placeholder: false,
				components: [
					new ActionRowBuilder().addComponents(
						new ChannelSelectMenuBuilder()
							.setCustomId('channel_hello')
							.setMinValues(1)
							.setMaxValues(1)
							.setPlaceholder(channel_join ? `✅ Выбран: #${channel_join.name}`
								: 'Выберите: Канал для приветствий')
							.setChannelTypes(ChannelType.GuildText)
					),
					new ActionRowBuilder().addComponents(
						new RoleSelectMenuBuilder()
							.setCustomId('autorole_hello')
							.setMinValues(1)
							.setMaxValues(1)
							.setPlaceholder(role_join ? `✅ Выбран: #${role_join.name}`
								: 'Выберите: Роль, которая будет выдаваться')
					)
				]
			},
			{
				lable: '## 2/2 • Chat GPT',
				state: 'state_gpt',
				components: [
					new ActionRowBuilder().addComponents(
						new ChannelSelectMenuBuilder()
							.setCustomId('channel_gpt')
							.setMinValues(1)
							.setMaxValues(1)
							.setPlaceholder(gpt_channel ? `✅ Выбран: #${gpt_channel.name}`
								: 'Выберите: Канал для AI')
							.setChannelTypes(ChannelType.GuildText)
					)
				]
			}
		];

		const message = await interaction.reply(GetMenuPage(settings_pages, MemGuild));

		const collector = message.createMessageComponentCollector({ time: 300000 });
		collector.on('collect', async (i) => {
			if (i.user.id !== interaction.user.id) return;

			if (i.customId === 'settings_prev') {
				if (current_page > 0) current_page -= 1;
			}

			if (i.customId === 'settings_next') {
				if (current_page + 1 < settings_pages.length) current_page += 1;
			}

			if (i.customId === 'settings_status') {
				const page_state = settings_pages[current_page].state;
				MemGuild[page_state] = !MemGuild[page_state];

				if (MemGuild[page_state] && current_page === 1 && MemGuild.system_gpt.channel) {
					await createGPTWebhook(MemGuild.system_gpt.channel);
				}
			}

			if (i.customId === 'channel_hello') {
				MemGuild.system_join.channel_join = String(i.values[0]);
			}

			if (i.customId === 'autorole_hello') {
				MemGuild.system_join.role_join = String(i.values[0]);
			}

			if (i.customId === 'channel_gpt') {
				MemGuild.system_gpt.channel = String(i.values[0]);

				if (settings_pages[current_page].state) {
					await createGPTWebhook(i.values[0]);
				}
			}

			await i.deferUpdate();
			await message.edit(GetMenuPage(settings_pages, MemGuild));
		});
	}
};

async function createGPTWebhook(channelId) {
	const channel = client.channels.cache.get(channelId) as TextChannel;
	channel.createWebhook({
		name: 'do GPT',
		avatar: 'https://i.imgur.com/4Ya6u4B.png',
	})
		.then((webhook) => {
			webhook.send(`### Привет, я Chat GPT!
Я здесь, чтобы помочь вам с ответами на ваши вопросы и поддержать беседу.
Не стесняйтесь обращаться ко мне с любыми вопросами или темами, и я постараюсь помочь вам.
Для начала разговора достаточно **написать в чат**.
`);
		})
		.catch(console.error);
}

function GetMenuPage(settings_pages, MemGuild) {
	const page_state = settings_pages[current_page].state;

	const status = new ButtonBuilder()
		.setCustomId('settings_status')
		.setLabel(`Статус: ${MemGuild[page_state] ? 'Включено' : 'Выключено'}`)
		.setStyle(MemGuild[page_state] ? ButtonStyle.Success : ButtonStyle.Secondary);

	const prev = new ButtonBuilder()
		.setCustomId('settings_prev')
		.setEmoji('<:leftarrow:1129406663649153065> ')
		.setStyle(ButtonStyle.Secondary);

	const next = new ButtonBuilder()
		.setCustomId('settings_next')
		.setEmoji('<:rightarrow:1129406683270103160>')
		.setStyle(ButtonStyle.Secondary);

	return {
		content: settings_pages[current_page].lable,
		components: [
			...settings_pages[current_page].components,
			new ActionRowBuilder().addComponents(prev, status, next)
		],
		ephemeral: true
	};
}

export default cmd;
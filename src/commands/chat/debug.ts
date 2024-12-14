import { ButtonStyle } from 'discord.js';
import table from 'text-table';
import { Command } from '../../types.js';

const cmd: Command = {
	name: 'debug',
	description: '',

	run: async (client, message) => {
		if (message.channel.type != 1) return;
		if (message.author.id != bot.adminId) return;

		const action: any = {
			type: 1, // Action Row
			components: [{
				type: 2, // BUTTON
				custom_id: 'welcome_debug',
				label: 'Welcome',
				style: ButtonStyle.Secondary,
				url: null,
				disabled: false
			}, {
				type: 2, // BUTTON
				custom_id: 'menu_invite',
				label: 'Инвайт',
				style: ButtonStyle.Secondary,
				url: null,
				disabled: false
			}, {
				type: 2, // BUTTON
				custom_id: 'menu_stat',
				label: 'Статистика пользователя',
				style: ButtonStyle.Primary,
				url: null,
				disabled: false
			}]
		};

		const t = [['#ID', 'NAME', 'OWNER']];

		await client.guilds.cache.forEach((guild: any) => {
			t.push([guild.id, guild.name, guild.ownerId]);
		});
		const tableRoles = table(t);

		const debugEmbed = {
			color: 0xffffff,
			title: 'Admin Panel',
			description: `\`\`\`md\n${tableRoles}\`\`\``
		};

		await message.channel.send({ embeds: [debugEmbed], components: [action] });
	}
};

export default cmd;
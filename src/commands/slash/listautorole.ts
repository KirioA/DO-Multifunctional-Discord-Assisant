import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'listautorole',
	description: 'Получить список всех ролей, которые выдаются при достижении уровня.',
	defaultPermission: true,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;
		const MemGuild = await DB.getGuild(interaction.guild);

		let text = '';
		console.log(MemGuild.level_roles);
		if (Object.entries(MemGuild.level_roles).length > 0) {
			// eslint-disable-next-line no-restricted-syntax, guard-for-in, prefer-const
			for (let key in MemGuild.level_roles) {
				text = text.concat('\n', `${key} **|** <@&${MemGuild.level_roles[key]}>`);
			}
		} else {
			sendEmbed.error(interaction, 'Список пуст.');
		}

		const listEmbed = {
			color: client.color,
			title: 'Список уровней с автовыдачей ролей',
			description: text
		};

		await interaction.reply({ embeds: [listEmbed] });
	}
};

export default cmd;
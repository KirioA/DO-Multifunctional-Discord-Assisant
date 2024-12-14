import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'listmoder',
	description: 'Получить список всех ролей имеющих права модератора.',
	defaultPermission: true,
	default_member_permissions: PermissionFlagsBits.Administrator,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;
		const MemGuild = await DB.getGuild(interaction.guild);

		let text = '';
		MemGuild.moder_roles.forEach((element:string|number) => {
			text = text.concat('\n', `<@&${element}>`);
		});

		const listModerEmbed = {
			color: client.color,
			title: 'Список ролей с правами модератора',
			description: text
		};

		await interaction.reply({ embeds: [listModerEmbed] });
	}
};

export default cmd;
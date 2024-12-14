import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'addmoder',
	description: 'Выдать определенной роли права модератора.',
	options: [{
		name: 'role',
		description: 'Роль, которой необходимо выдать права модератора',
		type: ApplicationCommandOptionType.Role,
		required: true
	}],

	defaultPermission: true,
	default_member_permissions: PermissionFlagsBits.Administrator,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;
		const MemGuild = await DB.getGuild(interaction.guild);

		const role = await interaction.options.getRole('role');
		const roleId = role.id;

		if (MemGuild.moder_roles.includes(roleId)) {
			const addModerEmbed = {
				color: client.color,
				description: `Роль ${role} уже находится в списке!`
			};
			await interaction.reply({ embeds: [addModerEmbed] });
		}

		const addModerEmbed = {
			color: client.color,
			description: `Права модератора были назначены роли ${role}`
		};

		MemGuild.moder_roles.push(roleId);
		await interaction.reply({ embeds: [addModerEmbed] });
	}
};

export default cmd;
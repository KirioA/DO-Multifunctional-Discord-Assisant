import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'delmoder',
	description: 'Забрать у определенной роли права модератора.',
	options: [{
		name: 'role',
		description: 'Роль, которой необходимо снять права модератора',
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

		MemGuild.moder_roles.forEach((element: any, index: any) => {
			if (element == roleId) MemGuild.moder_roles.splice(index, 1);
		});

		const addModerEmbed = {
			color: client.color,
			description: `Права модератора были сняты с роли ${role}`
		};

		await interaction.reply({ embeds: [addModerEmbed] });
	}
};

export default cmd;
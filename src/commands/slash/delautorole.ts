import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'delautorole',
	description: 'Убрать роль из автовыдачи при достижении уровня.',
	options: [{
		name: 'lvl',
		description: 'Уровень, к которому привязана роль',
		type: ApplicationCommandOptionType.Integer, /* INTEGER */
		required: true
	}],

	defaultPermission: true,
	default_member_permissions: PermissionFlagsBits.Administrator,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;

		const inputLvl = interaction.options.getInteger('lvl');

		const MemGuild = await DB.getGuild(interaction.guild);

		if (!MemGuild.level_roles[inputLvl]) {
			sendEmbed.error(interaction, `К уровню **${inputLvl}** не привязана ни одна роль!`);
			return;
		}
		const Embed = {
			color: client.color,
			description: `С уровня **${inputLvl}** снята автовыдача.`
		};

		delete MemGuild.level_roles[inputLvl];
		await interaction.reply({ embeds: [Embed] });
	}
};

export default cmd;
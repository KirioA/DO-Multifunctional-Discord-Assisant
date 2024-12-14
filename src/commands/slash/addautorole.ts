import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'addautorole',
	description: 'Добавить выдачу роли при достижении уровня.',

	options: [{
		name: 'addlvl',
		description: 'Уровень, при достижении которого должна быть выдана роль',
		type: ApplicationCommandOptionType.Integer,
		required: true
	}, {
		name: 'addrole',
		description: 'Роль, которая должна быть выдана',
		type: ApplicationCommandOptionType.Role,
		required: true
	}],

	defaultPermission: true,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;

		const inputRole = await interaction.options.getRole('addrole');
		const inputLvl = interaction.options.getInteger('addlvl');

		console.log(`input lvlv = ${inputLvl}`);

		const MemGuild = await DB.getGuild(interaction.guild);
		const levelRoles = MemGuild.level_roles;

		if (inputLvl <= 0) {
			sendEmbed.error(interaction, 'Уровень не может быть меньше нуля!');
			return;
		}
		const Embed = {
			color: client.color,
			description: `На **${inputLvl}** назначена роль <@&${inputRole.id}>.`
		};

		levelRoles[inputLvl] = inputRole.id;
		MemGuild.level_roles = levelRoles;
		await interaction.reply({ embeds: [Embed] });
	}
};

export default cmd;
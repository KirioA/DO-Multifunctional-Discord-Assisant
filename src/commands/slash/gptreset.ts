import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'gptreset',
	description: 'Удалить записи о предыдущих сообщениях для AI.',
	options: [],
	defaultPermission: true,
	// default_member_permissions: PermissionFlagsBits.Administrator,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;

		await interaction.deferReply();

		const MemGuild = await DB.getGuild(interaction.guild);

		MemGuild.message_conversatio_id = '';
		MemGuild.message_parent_id = '';

		await interaction.editReply('Контекст беседы был сброшен.');
	}
};

export default cmd;
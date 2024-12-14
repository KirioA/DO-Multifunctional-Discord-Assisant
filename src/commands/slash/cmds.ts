import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'cmds',
	description: 'Список команд и описаний.',

	options: [],
	defaultPermission: true,

	run: async (client, interaction) => {
		let cmds = '';
		client.commands.forEach((val) => {
			if (val.name == 'debug') return;
			cmds = cmds.concat(`**!${val.name}** - ${val.description}\n`);
		});

		await sendEmbed.info(interaction, 'Команды', cmds);
	}
};

export default cmd;
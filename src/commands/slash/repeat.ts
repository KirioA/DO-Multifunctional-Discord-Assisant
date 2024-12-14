import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'repeat',
	description: 'Включить/выключить режим повтора.',
	options: [{
		name: 'type',
		description: 'Тип: выключить/песня/очередь',
		type: ApplicationCommandOptionType.Integer,
		required: true,
		choices: [
			{ name: 'выключить', value: 0 },
			{ name: 'песня', value: 1 },
			{ name: 'очередь', value: 2 }
		]
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		if (!interaction.member.voice.channel) return sendEmbed.error(interaction, 'Вы должны находится в голосовом канале!');
		if (interaction.member.voice.channelId != interaction.guild.members.cache.get(client.user.id).voice.channelId) {
			return sendEmbed.error(interaction, 'Вы должны быть в канале бота!');
		}

		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);
		const mode = interaction.options.getInteger('type');

		try {
			if (!queue) return sendEmbed.error(interaction, 'На данный момент ничего не играет!');
			const success = queue.setRepeatMode(mode);
			// eslint-disable-next-line no-nested-ternary
			const text = mode > 0
				? (mode == 1 ? 'Текущая песня зациклена.' : 'Очередь зациклена.')
				: 'Повторение отключено, произведения будут воспроизводится в порядке очереди.';
			sendEmbed.info(interaction, 'Цикл', success ? text : 'Возникла ошибка, попробуйте снова.');
		} catch (e) {
			console.log(`
				Command: ${interaction?.commandName}
				Error: ${e}
				User: ${interaction?.user?.tag} (${interaction?.user?.id})
				Guild: ${interaction?.guild?.name} (${interaction?.guild?.id})
				Command Usage Channel: ${interaction?.channel?.name} (${interaction?.channel?.id})
				User Voice Channel: ${interaction?.member?.voice?.channel?.name} (${interaction?.member?.voice?.channel?.id})
				`);
		}
	}
};

export default cmd;
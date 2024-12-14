import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'stop',
	description: 'Остановить воспроизведение.',

	defaultPermission: true,

	run: async (client, interaction) => {
		const queue = client.player.getQueue(interaction.guild.id);
		if (!queue) return sendEmbed.error(interaction, 'На данный момент ничего не играет!');

		if (!interaction.member.voice.channel) return sendEmbed.error(interaction, 'Вы должны находится в голосовом канале!');
		if (interaction.member.voice.channelId != interaction.guild.members.cache.get(client.user.id).voice.channelId) {
			return sendEmbed.error(interaction, 'Вы должны быть в канале бота!');
		}

		await interaction.deferReply();

		try {
			queue.stop(interaction.guild.id);
			interaction.reply({
				embeds: [{
					color: client.color,
					title: 'Стоп',
					description: 'Прослушивание музыки остановлено досрочно.',
					footer: { text: `✋ ${interaction.user.tag}` }
				}]
			});
			return;
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
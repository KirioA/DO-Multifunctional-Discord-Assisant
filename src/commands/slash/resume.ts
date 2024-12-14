import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'resume',
	description: 'Продолжить воспроизведение после паузы.',
	defaultPermission: true,

	run: async (client, interaction) => {
		if (!interaction.member.voice.channel) {
			return sendEmbed.error(interaction, 'Вы должны находится в голосовом канале!');
		}
		if (interaction.member.voice.channelId != interaction.guild.members.cache.get(client.user.id).voice.channelId) {
			return sendEmbed.error(interaction, 'Вы должны быть в канале бота!');
		}
		const queue = client.player.getQueue(interaction.guild.id);
		await interaction.deferReply();

		try {
			if (!queue) return sendEmbed.error(interaction, 'На данный момент ничего не играет!');
			if (!queue.paused) return sendEmbed.error(interaction, 'Произведение не стоит на паузе!');
			const success = queue.resume();
			interaction.reply({
				embeds: [{
					color: client.color,
					title: 'Вопроизведение',
					description: success ? `**${queue.songs[0].name}** была запущена.` : 'Возникла ошибка, попробуйте снова.',
					footer: { text: `▶️ ${interaction.user.tag}` }
				}]
			});
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
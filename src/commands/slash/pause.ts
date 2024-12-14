import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'pause',
	description: 'Поставить воспроизведение на паузу.',

	defaultPermission: true,

	run: async (client, interaction) => {
		if (!interaction.member.voice.channel) return sendEmbed.error(interaction, 'Вы должны находится в голосовом канале!');
		if (interaction.member.voice.channelId != interaction.guild.members.cache.get(client.user?.id).voice.channelId) {
			return sendEmbed.error(interaction, 'Вы должны быть в канале бота!');
		}

		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		try {
			if (!queue || !queue.playing) return sendEmbed.error(interaction, 'На данный момент ничего не играет!');
			const success = queue.pause();
			interaction.reply({
				embeds: [{
					color: client.color,
					title: 'Пауза',
					description: success ? `**${queue.songs[0].name}** была поставлена на паузу.` : 'Возникла ошибка, попробуйте снова.',
					footer: { text: `⏸️ ${interaction.user.tag}` }
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
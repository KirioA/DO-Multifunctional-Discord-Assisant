import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'volume',
	description: 'Установить громкость воспроизведения.',
	options: [{
		name: 'volume',
		description: 'Введите число, чтобы отрегулировать громкость',
		type: ApplicationCommandOptionType.Integer,
		required: true
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		if (!interaction.member.voice.channel) return sendEmbed.error(interaction, 'Вы должны находится в голосовом канале!');
		if (interaction.member.voice.channelId != interaction.guild.members.cache.get(client.user.id).voice.channelId) {
			return sendEmbed.error(interaction, 'Вы должны быть в канале бота!');
		}

		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);
		const volume = interaction.options.getInteger('volume');

		try {
			if (!queue || !queue.playing) return sendEmbed.error(interaction, 'На данный момент ничего не играет!');
			if (volume < 5 || volume > 100) return sendEmbed.error(interaction, 'Громкость не может превышать 100 и быть ниже 5.');

			const success = queue.setVolume(volume);
			interaction.reply({
				embeds: [{
					color: client.color,
					title: 'Громкость',
					description: success ? `Установлена громкость **${volume}**/**100**` : 'Возникла ошибка, попробуйте снова.',
					footer: { text: `🔉 ${interaction.user.tag}` }
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
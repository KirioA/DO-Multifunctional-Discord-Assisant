import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'skip',
	description: 'Пропустить текущий трек.',
	options: [{
		name: 'amount',
		description: 'Количество треков, которые необходимо пропустить',
		type: ApplicationCommandOptionType.Number,
		required: false
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		const queue = client.player.getQueue(interaction.guild.id);
		if (!queue || !queue.playing) return sendEmbed.error(interaction, 'На данный момент ничего не играет!');

		if (!interaction.member.voice.channel) return sendEmbed.error(interaction, 'Вы должны находится в голосовом канале!');
		if (interaction.member.voice.channelId != interaction.guild.members.cache.get(client.user.id).voice.channelId) {
			return sendEmbed.error(interaction, 'Вы должны быть в канале бота!');
		}

		await interaction.deferReply();

		const amount = interaction.options.getNumber('amount') || 1;

		try {
			if (amount < 1) return sendEmbed.error(interaction, 'Количество пропускаемых песен не может быть меньше одной.');

			const skipedSong = queue.songs[0];
			try {
				await client.player.jump(interaction, amount);
				interaction.reply({
					embeds: [{
						color: client.color,
						title: 'Скип',
						description: `**${skipedSong.name}** была пропущена.\nВсего пропущено: **${amount}**`,
						footer: { text: `⏭️ ${interaction.user.tag}` }
					}]
				});
			} catch (e) {
				sendEmbed.error(interaction, 'Вы указали больше, чем есть треков в очереди.').catch(console.log);
			}
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
import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'play',
	description: 'Воспроизведение треков/плейлистов в голосовом канале.',

	options: [{
		name: 'text',
		description: 'Имя трека или ссылка на плейлист',
		type: ApplicationCommandOptionType.String, /* USER */
		required: true
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		const song = interaction.options.getString('text');
		if (!interaction.member.voice.channel) return sendEmbed.error(interaction, 'Вы должны находится в голосовом канале!');

		if (song.includes('soundcloud.com')) {
			sendEmbed.error(interaction, 'На данный момент бот не поддерживает музыку с сервиса \`soundcloud\`');
			return;
		}

		if (song.includes('music.yandex.ru')) {
			sendEmbed.error(interaction, 'На данный момент бот не поддерживает музыку с сервиса \`yandex.music\`');
			return;
		}

		await interaction.deferReply();

		try {
			if (!song) return sendEmbed.error(interaction, 'Вы не указали название песни, которую хотите включить!');

			await interaction.reply({ content: 'Секунду, сейчас начнется воспроизведение.', ephemeral: true });
			try {
				await client.player.play(interaction.member.voice.channel, song, {
					member: interaction.member,
					textChannel: interaction.channel,
					interaction
				});
			} catch (e) {
				console.log(e);
				await interaction.editReply({ content: 'Не найдено!', ephemeral: true });
			}
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
import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';

const cmd: SlashCommand = {
	name: 'radio',
	description: 'Воспроизведение радиостанции в реальном времени.',

	options: [{
		name: 'radioname',
		description: 'Радиостанция',
		type: ApplicationCommandOptionType.String,
		required: true,
		choices: [
			{ name: 'Energy FM',		value: 'energy' },
			{ name: 'Lo-Fi Hip Hop',	value: 'lofihiphop' },
			{ name: 'Radio Record',		value: 'record' },
			{ name: 'Record Lo-Fi',		value: 'lofi' },
			{ name: 'Retro FM',			value: 'retro' },
			{ name: 'Studio 21',		value: 'studio21' }
		]
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		const radioName = interaction.options.getString('radioname');
		if (!interaction.member.voice.channel) return sendEmbed.error(interaction, 'Вы должны находится в голосовом канале!');
		if (!radioName) return;
		await interaction.deferReply();

		const exampleEmbed = {
			color: client.color,
			title: getRadio(radioName).name,
			thumbnail: {
				url: getRadio(radioName).image
			},
			fields: [
				{ name: 'Время', value: 'Radio', inline: true },
				{ name: 'Битрейт', value: '256 kbps', inline: true }
			],
			footer: {
				text: `🎧 ${interaction.user.tag}`
			}
		};

		try {
			await interaction.reply({ content: 'Трансляция сейчас начнётся...', ephemeral: true }).catch(console.log);
			await interaction?.channel?.send({ embeds: [exampleEmbed] }).catch((e: any) => { console.log(e); });
			try {
				await client.player.play(interaction.member.voice.channel, getRadio(radioName).url, {
					member: interaction.member,
					textChannel: interaction.channel,
					interaction
				});
			} catch (e) {
				console.log(e);
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

function getRadio(name: string) {
	interface radios {
		[key: string]: any,
	}
	const radios: radios = {
		record: {
			name: 'Radio Record',
			url: 'https://radiorecord.hostingradio.ru/rr_main96.aacp',
			image: 'https://i.imgur.com/MAC6NYS.jpg'
		},
		lofi: {
			name: 'Record Lo-Fi',
			url: 'https://radiorecord.hostingradio.ru/lofi96.aacp',
			image: 'https://i.imgur.com/mmqOrVw.jpg'
		},
		energy: {
			name: 'Energy FM',
			url: 'https://pub0202.101.ru:8443/stream/air/aac/64/99',
			image: 'https://i.imgur.com/NOqMmaU.jpg'
		},
		retro: {
			name: 'Retro FM',
			url: 'http://retroserver.streamr.ru:8043/retro256.mp3',
			image: 'https://i.imgur.com/eJca49C.jpg'
		},
		lofihiphop: {
			name: 'Lo-Fi Hip Hop Radio',
			url: 'https://youtu.be/jfKfPfyJRdk',
			image: 'https://i.imgur.com/CzUr4tP.jpg'
		},
		studio21: {
			name: 'Studio 21',
			url: 'http://icecast-studio21.cdnvideo.ru/S21cl_1r',
			image: 'https://i.imgur.com/30EXKPM.jpg'
		}
	};
	return radios[name];
}
import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'setlvl',
	description: 'Изменить уровень пользователя.',

	options: [{
		name: 'user',
		description: 'Пользователь',
		type: ApplicationCommandOptionType.User, /* USER */
		required: true
	}, {
		name: 'lvl',
		description: 'Уровень',
		type: ApplicationCommandOptionType.Integer, /* INTEGER */
		required: true
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;

		const member = await interaction.options.getMember('user');
		const valueLvl = interaction.options.getInteger('lvl');

		const MemMember = await DB.getGuildMember(interaction.guild, member);

		if (!member) {
			sendEmbed.error(interaction, 'Пользователя нет на сервере!');
			return;
		}

		if (valueLvl <= 0) {
			sendEmbed.error(interaction, 'Неверное значение level!');
			return;
		}

		if (valueLvl > 80) return sendEmbed.error(interaction, 'Максимальное значение - 80 уровень.');

		const muteEmbed = {
			color: client.color,
			title: 'Уровень',
			fields: [
				{
					name: 'Пользователь',
					value: `<@${member.id}>`,
					inline: true
				},
				{
					name: 'Новое значение',
					value: String(valueLvl),
					inline: true
				}
			],
			timestamp: new Date(),
			footer: {
				text: interaction.user.tag,
				icon_url: interaction.user.avatarURL()
			}
		};

		MemMember.level = valueLvl;
		await interaction.reply({ embeds: [muteEmbed] });
	}
};

export default cmd;
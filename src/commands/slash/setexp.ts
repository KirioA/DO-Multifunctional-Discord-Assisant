import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'setexp',
	description: 'Изменить значение exp пользователю.',

	options: [{
		name: 'user',
		description: 'Пользователь',
		type: ApplicationCommandOptionType.User, /* USER */
		required: true
	}, {
		name: 'exp',
		description: 'Очки опыта (exp)',
		type: ApplicationCommandOptionType.Integer, /* INTEGER */
		required: true
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;

		const member = await interaction.options.getMember('user');
		const valueExp = interaction.options.getInteger('exp');

		const MemMember = await DB.getGuildMember(interaction.guild, member);

		if (!member) {
			sendEmbed.error(interaction, 'Пользователя нет на сервере!');
			return;
		}

		if (valueExp <= 0) {
			sendEmbed.error(interaction, 'Неверное значение exp!');
			return;
		}

		if (valueExp > 100) return sendEmbed.error(interaction, 'Максимальное значение - 100 exp.');

		const muteEmbed = {
			color: client.color,
			title: 'Опыт',
			fields: [
				{
					name: 'Пользователь',
					value: `<@${member.id}>`,
					inline: true
				},
				{
					name: 'Exp',
					value: `${valueExp}`,
					inline: true
				}
			],
			timestamp: new Date(),
			footer: {
				text: interaction.user.tag,
				icon_url: interaction.user.avatarURL()
			}
		};

		MemMember.exp = valueExp;
		await interaction.reply({ embeds: [muteEmbed] });
	}
};

export default cmd;
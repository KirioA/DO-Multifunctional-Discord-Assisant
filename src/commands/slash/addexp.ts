import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'addexp',
	description: 'Добавить пользователю exp к текущим.',

	options: [{
		name: 'user',
		description: 'Пользователь',
		type: ApplicationCommandOptionType.User, /* USER */
		required: true
	}, {
		name: 'exp',
		description: 'Кол-во exp',
		type: ApplicationCommandOptionType.Integer, /* INTEGER */
		required: true
	}],

	defaultPermission: true,

	run: async (client, interaction) => {
		if (!CheckModer(interaction)) return;

		const member = interaction.options.getMember('user');
		const valueExp = Number(interaction.options.get('exp')?.value);

		const MemMember = await DB.getGuildMember(interaction.guild, member);

		if (!member) {
			sendEmbed.error(interaction, 'Пользователя нет на сервере!');
			return;
		}

		if (valueExp <= 0) {
			sendEmbed.error(interaction, 'Неверное значение exp!');
			return;
		}

		if (valueExp > 100) return interaction.reply('Максимальное значение - 100 exp.');

		const expEmbed: any = {
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
					value: `${Math.trunc(MemMember.exp)}(+${valueExp})`,
					inline: true
				}
			],
			timestamp: new Date(),
			footer: {
				text: interaction.user.tag,
				icon_url: interaction.user.avatarURL()
			}
		};

		rankSystem.addExp(member, valueExp);
		interaction.reply({ embeds: [expEmbed] });
	}
};

export default cmd;
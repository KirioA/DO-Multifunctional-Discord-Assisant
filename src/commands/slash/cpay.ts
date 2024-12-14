import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'cpay',
	description: 'Перевести клеверы упомянутому пользователю.',

	options: [{
		name: 'user',
		description: 'Пользователь',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'clovers',
		description: 'Количество клеверов (максимум 20, раз в 5 часов)',
		type: ApplicationCommandOptionType.Integer,
		required: true
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		const member = await interaction.options.getUser('user');
		const clovers = interaction.options.getInteger('clovers');

		const whoPay = await DB.getUser(interaction.member);
		const whoGet = await DB.getUser(member);

		if (clovers <= 0) return sendEmbed.error(interaction, 'Неверное значение клеверов!');
		if (clovers > 20) return sendEmbed.error(interaction, 'Перевести можно не более 20 клеверов.');

		if ((await client.users.fetch(member)).bot) return sendEmbed.error(interaction, 'Нельзя перевести этому пользователю!');
		if (whoPay.clovers < clovers) {
			sendEmbed.error(interaction, `У Вас не хватает! Всего у Вас: ${whoPay.clovers}`);
			return;
		}

		if (!whoGet) {
			sendEmbed.error(interaction, 'Такого пользователя нет в базе данных!');
			return;
		}

		whoPay.clovers -= clovers;
		whoGet.clovers += clovers;

		sendEmbed.info(interaction.channel, 'Перевод', `<:clovers:1036352922486841354> <@${whoPay.id}> перевел <@${whoGet.id}> **${clovers}** клеверов.`);
		// eslint-disable-next-line max-len
		log.add(`${interaction.guild.name} [${interaction.guild.id}] [CLOVER-PAY] ${interaction.member.user.tag} [${interaction.member.id}] перевел ${member.tag} [${member.id}] ${clovers} клевер(ов).`);

		await interaction.reply({ content: 'Успешно!', ephemeral: true });
	}
};

export default cmd;
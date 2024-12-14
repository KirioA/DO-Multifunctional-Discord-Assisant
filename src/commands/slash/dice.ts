import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'dice',
	description: 'Тестовая игра "Кости"',

	options: [{
		name: 'clovers',
		description: 'Количество клеверов',
		type: ApplicationCommandOptionType.Integer,
		required: true
	}, {
		name: 'val',
		description: 'Какая грань выпадет? (1-6)',
		type: ApplicationCommandOptionType.Integer,
		required: true
	}],
	defaultPermission: true,

	run: async (client, interaction) => {
		const cloversBet = interaction.options.getInteger('clovers');
		const valueBet = interaction.options.getInteger('val');

		if (valueBet < 1 || valueBet > 6) return sendEmbed.error(interaction, 'Укажите верное число на игральном кубике на которое вы хотите поставить.');

		const player = await DB.getUser(interaction.member);

		if (player.clovers < cloversBet) return sendEmbed.error(interaction, `Вы не можете поставить ${cloversBet}, у вас всего: **${player.clovers}**`);

		const win = getRandomInt(1, 6);
		if (valueBet == win) {
			const winClovers = cloversBet * 4;
			player.clovers += winClovers;
			interaction.reply(`Ты выйграл! Выпало: **${win}**\nТы забираешь **${winClovers}**`);
			return;
		}

		player.clovers -= cloversBet;
		interaction.reply(`К сожалению, не повезло! Выпало: **${win}**\nТвой баланс: **${player.clovers}**`);
	}
};

export default cmd;

function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}
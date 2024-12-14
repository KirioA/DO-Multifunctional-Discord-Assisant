import { Message } from 'discord.js';
import { Command } from '../../types.js';

const cmd: Command = {
	name: 'clear',
	description: 'Удалить сообщения в чате.',
	botPerms: ['ManageMessages'],

	run: async (client, message) => {
		if (message.channel.type != 0) return;

		if (!CheckModer(message)) return;
		if (!message.args[0]) {
			sendEmbed.error(message, 'Введите количество сообщений для очистки!');
			return;
		}

		if (!Number.isInteger(+message.args[0])) {
			sendEmbed.error(message, 'Укажите число сообщений для очистки!');
			return;
		}

		if (Number(message.args[0]) < 1 || Number(+message.args[0] > 100)) {
			sendEmbed.error(message, 'Очистить можно не менее 1 и не более 100 сообщений за раз.');
			return;
		}

		const amount = Number(message.args[0]) > 100 ? 100 : Number(message.args[0]);
		await message.channel
			.bulkDelete(amount)
			.then((_message: any) => {
				if (message.channel.type != 0) return;

				message.channel
					.send(`Успешно удалено \`${_message.size}\` сообщений.`)
					.then((sent) => {
						setTimeout(() => { sent.delete(); }, 2000);
					});

				log.add(`[${message.channel.name}] [CLEAR] ${message.author.tag} очистил ${_message.size} сообщений.`, message.guild);
			})
			.catch((err: any) => {
				if (err.code == 50034) {
					sendEmbed.error(message, 'Удаление невозможно, сообщениям больше 14 дней.');
				} else if (err.code == 50013) {
					sendEmbed.error(message, 'Недостаточно прав для удаления сообщений этого пользователя.');
				} else {
					sendEmbed.error(message, `Ошибка: ${err.code}`);
				}
			});
	}
};

export default cmd;
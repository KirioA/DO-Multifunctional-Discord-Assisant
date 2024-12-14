import fetch from 'node-fetch';
import { Command } from '../../types.js';

async function getRandomDog() {
	const response = await fetch('https://api.thedogapi.com/v1/images/search');
	const json = await response.json();
	return json[0]?.url;
}

const cmd: Command = {
	name: 'dog',
	description: 'Получить случайную картинку собаки.',

	run: async (client, message) => {
		if (message.channel.type != 0) return;

		try {
			const dogURL = await getRandomDog();
			const embed = {
				color: client.color,
				image: {
					url: dogURL
				}
			};
			if (dogURL) return message.channel.send({ embeds: [embed] });
		} catch (error) {
			console.error(error);
			await message.reply('Не удалось найти картинку! Попробуйте позже.');
		}
	}
};

export default cmd;
import fetch from 'node-fetch';
import { Command } from '../../types.js';

async function getRandomCat() {
	const response = await fetch('https://api.thecatapi.com/v1/images/search');
	const json = await response.json();
	return json[0]?.url;
}

const cmd: Command = {
	name: 'cat',
	description: 'Получить случайную картинку кота.',

	run: async (client, message) => {
		if (message.channel.type != 0) return;

		try {
			const cat = await getRandomCat();
			const embed = {
				color: client.color,
				image: {
					url: cat
				}
			};
			if (cat) return message.channel.send({ embeds: [embed] });
		} catch (error) {
			console.error(error);
			await message.reply('Не удалось найти картинку! Попробуйте позже.');
		}
	}
};

export default cmd;
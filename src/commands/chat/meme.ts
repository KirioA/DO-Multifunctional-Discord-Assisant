import fetch from 'node-fetch';
import { Command } from '../../types.js';

async function getRandomMeme() {
	const response = await fetch('https://meme-api.com/gimme');
	const json = await response.json();
	return json[0]?.url;
}

const cmd: Command = {
	name: 'meme',
	description: 'Получить случайный мем.',

	run: async (client, message) => {
		if (message.channel.type != 0) return;

		const memeURL = await getRandomMeme();

		await message.channel.send({
			embeds: [{
				color: client.color,
				image: {
					url: memeURL
				}
			}]
		});
	}
};

export default cmd;
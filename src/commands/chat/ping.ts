import { Command } from '../../types.js';

const cmd: Command = {
	name: 'ping',
	description: 'Узнать время отклика бота.',

	run: async (client, message) => {
		if (message.channel.type != 0) return;
		if (!CheckModer(message)) return;

		await message.channel.send('Проверяю...').then(async (msg) => {
			const ping = msg.createdTimestamp - message.createdTimestamp;
			msg.edit(`Ping (bot): ${Math.round((ping))}ms | Ping (api response): ${Math.round(client.ws.ping)}ms`);
		});
	}
};

export default cmd;
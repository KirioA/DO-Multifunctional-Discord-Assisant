// eslint-disable-next-line import/no-import-module-exports
import { Command } from '../../types.js';

const cmd: Command = {
	name: 'avatar',
	description: 'Получить аватар пользователя.',

	run: async (client, message) => {
		if (message.channel.type != 0) return;
		// eslint-disable-next-line max-len
		const member = message.mentions.users.first() || message.guild.members.cache.get(message.args[0]) || message.member;
		if (!member) return;

		const avatar = member.displayAvatarURL({ size: 1024 });

		const embed = {
			color: client.color,
			description: `**Фото профиля ${member}**`,
			image: {
				url: avatar
			}
		};

		message.channel.send({ embeds: [embed] });
	}
};

export default cmd;
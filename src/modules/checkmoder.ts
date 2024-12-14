import { DB } from './database.js';

global.CheckModer = async (message: any) => {
	const MemGuild = await DB.getGuild(message.guild);

	const moderRoles = MemGuild.moder_roles ?? [];

	if (message.member.roles.cache.some((r: any) => moderRoles.includes(r.id))
		|| message.member.user.id == message.guild.ownerId
		|| message.member.user.id == bot.adminId
	) {
		return true;
	}

	message.reply('<:warn:1025456240211537921> Эта команда вам недоступна!')
		.then((sent: any) => {
			setTimeout(() => {
				if (message.applicationId) return message.deleteReply();
				sent.delete();
			}, 5000);
		});

	return false;
};

export default {};
import { Role } from 'discord.js';
import { DB } from '../modules/database.js';

client.on('roleDelete', async (role: Role) => {
	const MemGuild = await DB.getGuild(role.guild);
	if (!MemGuild) return;

	if (MemGuild.moder_roles.includes(role.id)) {
		const index = MemGuild.moder_roles.indexOf(role.id);
		MemGuild.moder_roles.splice(index, 1);
	}
});
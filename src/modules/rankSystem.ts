// eslint-disable-next-line import/no-import-module-exports
import { GuildMember } from 'discord.js';
import addexp from '../commands/slash/addexp.js';
import { DB } from './database.js';

const AddEXP = async (member: GuildMember, experience: number) => {
	if (member.user.bot) return;

	const MemGuild = await DB.getGuild(member.guild);
	const MemUser = await DB.getUser(member.user);
	const MemMember = await DB.getGuildMember(member.guild, member);

	const userXP = MemMember.exp + experience;
	const userLVL = MemMember.level;
	const expNextLVL = (userLVL * 2) + 2;

	MemUser.globalexp += experience;

	if (userXP >= expNextLVL) {
		MemMember.level += 1;
		MemMember.exp = userXP - expNextLVL;
		MemUser.clovers += MemMember.level;
		console.log(`${member.displayName}: Новый уровень (${MemMember.level}) | Клеверы (${MemUser.clovers})`);
		if (MemGuild.level_roles[MemMember.level]) {
			try {
				const obj: any = Object.values(MemGuild.level_roles);
				member.guild.members.fetch(member.id)
					.then(async (memb) => {
						if (memb.roles.cache.some((r) => obj.includes(r.id))) {
							await memb.roles.remove(obj).catch((err) => {
								console.log(err);
							});
						}
						await memb.roles.add(MemGuild.level_roles[MemMember.level]);
					});
			} catch (e) {
				console.log(e);
			}
		}
		AddEXP(member, 0);
		return;
	}
	MemMember.exp += experience;
};

global.rankSystem = {
	addExp: AddEXP
};
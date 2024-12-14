// eslint-disable-next-line import/no-extraneous-dependencies
import { QuickDB } from 'quick.db';

console.log('Module DATABASE loaded!');

const db = new QuickDB();

class DB {
	static users = db.table('users');

	static guilds = db.table('guilds');

	private static createUser = async (user) => {
		await this.users.set(user.id, {
			name: user.username,
			globalexp: 0,
			clovers: 0
		});
	};

	private static createGuild = async (guild) => {
		await this.guilds.set(guild.id, {
			name: guild.name,
			owner: guild.ownerId,
			id: guild.id,
			state_join: false,
			system_join: {
				role_join: '',
				channel_join: ''
			},
			state_gpt: false,
			system_gpt: {
				channel: '',
				message_conversation_id: '',
				message_parent_id: ''
			},
			moder_roles: [],
			level_roles: {},
			members: {}
		});
	};

	private static createMember = async (guild, member) => {
		const memberObj = `${guild.id}.members.${member.id}`;

		await this.guilds.set(memberObj, {
			username: member.user.username,
			guildId: member.guild.id,
			messages: 0,
			level: 1,
			exp: 0,
			voice_time: 0
		});
	};

	static getUser = async (user) => {
		if (!await this.users.has(user.id)) {
			await this.createUser(user);
		}

		// return new Proxy(await this.users.get(user.id), {
		// 	set: (target, prop, value) => {
		// 		target[prop] = value;
		// 		this.users.set(user.id, target);
		// 		return true;
		// 	}
		// });

		const userObj = await this.users.get(user.id);
		return genProxy(this.users, userObj, user);
	};

	static getUsers = () => this.users;

	static getGuild = async (guild) => {
		if (!await this.guilds.has(guild.id)) {
			await this.createGuild(guild);
		}

		// return new Proxy(await this.guilds.get(guild.id), {
		// 	set: (target, prop, value) => {
		// 		target[prop] = value;
		// 		this.guilds.set(guild.id, target);
		// 		return true;
		// 	}
		// });

		const guildObj = await this.guilds.get(guild.id);
		return genProxy(this.guilds, guildObj, guild);
	};

	static getGuildMember = async (guild, member) => {
		const memberObj = `${guild.id}.members.${member.id}`;

		if (!await this.guilds.has(guild.id)) {
			await this.createGuild(guild);
		}

		if (!await this.guilds.has(memberObj)) {
			await this.createMember(guild, member);
		}

		return new Proxy(await this.guilds.get(memberObj), {
			set: (target, prop, value) => {
				// eslint-disable-next-line no-param-reassign
				target[prop] = value;
				this.guilds.set(memberObj, target);
				return true;
			}
		});
	};
}

function genProxy(table, db_obj, ds_obj) {
	const guildProxy = new Proxy(db_obj, {
		set: (target, prop, value) => {
			// eslint-disable-next-line no-param-reassign
			target[prop] = value;
			table.set(ds_obj.id, target);
			return true;
		}
	});

	return new Proxy(guildProxy, {
		get: (target, prop) => {
			if (typeof target[prop] === 'object' && target[prop] !== null) {
				return new Proxy(target[prop], {
					set: (nestedTarget, nestedProp, nestedValue) => {
						// eslint-disable-next-line no-param-reassign
						nestedTarget[nestedProp] = nestedValue;
						table.set(ds_obj.id, target); // Сохраняем обновленный объект guildObj в базу данных
						return true;
					}
				});
			}
			return target[prop];
		}
	});
}

// eslint-disable-next-line import/prefer-default-export
export { DB };
import { GuildMember, ChannelType, EmbedBuilder } from 'discord.js';
import { DB } from '../modules/database.js';

client.on('guildMemberAdd', async (member: GuildMember) => {
	if (!member.guild) return;

	const MemGuild = await DB.getGuild(member.guild);

	if (!MemGuild.state_join) return;
	const roleJoin = MemGuild.system_join.role_join;
	const channelJoin = MemGuild.system_join.channel_join;

	if (roleJoin) {
		try {
			member.roles.add(roleJoin).catch(console.log).catch((err) => {
				if (err.code == 50013) {
					const channel = member.guild.channels.cache.filter((c: any) => c.type == ChannelType.GuildText).first();
					if (channel.type != 0) return;
					channel.send('Бот не смог выдать роль новому участнику, т.к. у него нет права на выдачу ролей или выдаваемая роль выше роли бота.');
				}
			});
		} catch (e) {
			console.error(e);
		}
		const roleName = (await member.guild.roles.fetch(roleJoin)).name;
		log.add(`[SERVER] [JOIN] ${member.user.tag} подключился к серверу, получил роль ${roleName}`, member.guild);
	} else {
		log.add(`[SERVER] [JOIN] ${member.user.tag} подключился к серверу.`, member.guild);
	}

	if (channelJoin) {
		const phrases = [
			'Привет! Надеемся, вам у нас понравится.',
			'Здравствуй! Ты стал членом огромной семьи.',
			'Сердечно рады принять тебя в наш круг.',
			'Приветствуем! Мы рады, что ты стал частью нашего дружного сообщества.',
			'Привет! Ты именно тот, кого мы ждали. Искренне рады что ты с нами.',
			'Мы гордимся, что ты с нами, ведь уверены: ты способен на многое!',
			'Мы рады приветствовать тебя и желаем успехов!',
			'Добро пожаловать на сервер! Это замечательно, что ты с нами!',
			'Привет! Мы рады, что ты присоединился!',
			'Дорогой друг, приветствуем тебя! Покажи свой потенциал и реализуй амбиции!',
			'Привет! Нам нравится, что ты с нами.',
			'Здравствуй! Ты лучший! Именно поэтому ты здесь.',
			'Когда ты решил зайти сюда, ты сделал правильный выбор. Уверены, здесь тебе понравится.',
			'Как же это радость — приветствовать новенького! Надеемся, что ты найдешь общение.',
			'Привет! Ты сделал это! Мы рады, что ты с нами.',
			'Вместе мы сделаем больше, чем в одиночку. Верим в вас! Рады, что ты к нам присоединился.',
			'Всегда рады тебе! Быстрее осваивайся и вперед к победе!'
		];
		const rand = Math.floor(Math.random() * phrases.length);
		const embed = new EmbedBuilder()
			.setColor('Random')
			.setAuthor({
				name: phrases[rand],
				iconURL: member.displayAvatarURL({ size: 1024 })
			})
			.setDescription('Рады приветствовать на нашем сервере!\nУбедительно просим Вас ознакомиться с нашими правилами в канале *#rules*')
			.setFooter({
				text: `${member.user.tag} | ID:${member.id} | ${new Date().toLocaleDateString()}`
			})
		client.channels.cache.get(channelJoin).send({ content: member.toString(), embeds: [embed] });
	}
});
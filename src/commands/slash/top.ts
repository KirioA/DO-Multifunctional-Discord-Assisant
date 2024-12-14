// /* eslint-disable no-await-in-loop */
// /* eslint-disable array-callback-return */
// /* eslint-disable prefer-destructuring */
// /* eslint-disable dot-notation */
// /* eslint-disable max-len */
// /* eslint-disable no-continue */
// /* eslint-disable no-restricted-syntax */
// import { ApplicationCommandOptionType } from 'discord.js';
// import { SlashCommand } from '../../types.js';
// import { DB } from '../../modules/database.js';
//
// const filterObjectOnZeroValue = (obj: object, filter: string) => Object.keys(obj).reduce((acc, val) => (obj[val][filter] > 0 ? {
// 	...acc,
// 	[val]: obj[val]
// } : acc), {});
//
// const cmd: SlashCommand = {
// 	name: 'top',
// 	description: 'Показывает топ рейтинга участников, серверов.',
// 	cooldown: 10000,
//
// 	options: [{
// 		name: 'type',
// 		description: 'Тип рейтинга',
// 		type: ApplicationCommandOptionType.String, /* STRING */
// 		required: true,
// 		choices: [
// 			// { name: 'Пользователи сервера', value: 'local' },
// 			{ name: 'Глобальный топ пользователей', value: 'users' },
// 			// { name: 'Глобальный топ серверов', value: 'servers' }
// 		]
// 	}],
//
// 	defaultPermission: true,
//
// 	run: async (client, interaction) => {
// 		const typeTop = interaction.options.getString('type');
// 		const MemGuild = await DB.getGuild(interaction.guild);
// 		const embedInfo = {
// 			title: '',
// 			text: ''
// 		};
//
// 		switch (typeTop) {
// 			// case 'local': {
// 			// 	const users = MemGuild['_members'];
// 			//
// 			// 	const sorted = filterObjectOnZeroValue(users, 'globalexp');
// 			//
// 			// 	const sortedByValue = Object.keys(sorted).sort((a, b) => sorted[b].globalexp - sorted[a].globalexp)
// 			// 		.reduce((rslt, key) => rslt.set(key, sorted[key]), new Map());
// 			//
// 			// 	embedInfo.title = 'Топ пользователей сервера';
// 			// 	let i = 1;
// 			// 	for (const [key, user] of sortedByValue.entries()) {
// 			// 		if (i >= 21) break;
// 			// 		const userDB = await client.Memory.users.get(user.id);
// 			// 		const userDB = await DB.get
// 			// 		embedInfo.text = embedInfo.text.concat('\n', `**${i}. ${user.username}**\n<:2_:1036327666053292082> Уровень: ${user.level} | <:messages:1036351084400218193>: ${user.messages} | <:voices:1036351936166899813>: ${new Date(user.voice_time * 1000).toISOString().substr(11, 8)} | <:clovers:1036352922486841354>: ${userDB?.clovers || 0}`);
// 			// 		i += 1;
// 			// 	}
// 			// 	break;
// 			// }
//
// 			case 'users': {
// 				const globalUsers = await DB.getUsers();
//
// 				console.log(globalUsers);
//
// 				const sorted = filterObjectOnZeroValue(globalUsers, 'clovers');
// 				console.log(sorted);
//
// 				const sortedByValue = Object.keys(sorted).sort((a, b) => sorted[b].clovers - sorted[a].clovers)
// 					.reduce((rslt, key) => rslt.set(key, sorted[key]), new Map());
//
// 				embedInfo.title = 'Топ пользователей по клеверам';
// 				let i = 1;
// 				for (const [key, user] of sortedByValue.entries()) {
// 					embedInfo.text = embedInfo.text.concat('\n', `**${i}. ${user.name}**: <:clovers:1036352922486841354>: ${user.clovers}`);
// 					i += 1;
// 				}
// 				break;
// 			}
// 			// case 'servers': {
// 			// 	embedInfo.title = 'Топ пользователей по клеверам';
// 			// 	embedInfo.text = 'Отсутствует информация.';
// 			// 	break;
// 			// }
// 		}
//
// 		await interaction.reply({
// 			embeds: [{
// 				color: client.color,
// 				title: embedInfo.title,
// 				description: embedInfo.text
// 			}]
// 		});
// 	}
// };
//
// export default cmd;
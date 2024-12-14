import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import Canvacord from 'canvacord';
import { SlashCommand } from '../../types.js';
import { DB } from '../../modules/database.js';

const cmd: SlashCommand = {
	name: 'user',
	description: 'Информация об участнике (опыт, уровень)',
	cooldown: 10000,

	options: [{
		name: 'user',
		description: 'Пользователь',
		type: ApplicationCommandOptionType.User,
		required: false
	}],

	defaultPermission: true,

	run: async (client, interaction) => {
		const statUser = interaction.options.getMember('user') ?? interaction.member;
		let MemMember = await DB.getGuildMember(interaction.guild, statUser);

		if (!MemMember) {
			MemMember = {
				level: 1,
				exp: 0
			};
		}

		const rank = new Canvacord.Rank()
			.setAvatar(statUser.displayAvatarURL())
			.setLevel(MemMember.level)
			.setCurrentXP(Math.trunc(MemMember.exp))
			.setRequiredXP((MemMember.level * 2) + 2)
			.setStatus(statUser.presence ? statUser.presence.status : 'offline')
			.setProgressBar('#FFFFFF', 'COLOR')
			.setUsername(statUser.displayName)
			.setDiscriminator(statUser.displayName);

		await interaction.deferReply();
		await interaction.deleteReply();

		rank.build().then((data: any) => {
			const at = new AttachmentBuilder(data, { name: 'f.png' });
			interaction.channel.send({ files: [at] });
		});
	}
};

export default cmd;

import { Guild, ChannelType } from 'discord.js';
// const { ChannelType } = require('discord.js');

client.on('guildCreate', async (guild: Guild) => {
	const newsChannel = guild.channels.cache.filter((c: any) => c.type == ChannelType.GuildAnnouncement).first();

	const admin = await client.users.fetch(bot.adminId);
	const owner = await client.users.fetch(guild.ownerId);
	const usersOnGuild = guild.members.cache.filter((m: any) => m.user.bot === false).size;
	const embed = {
		color: 0xffffff,
		title: 'ADD NEW GUILD',
		description: `Guild: **${guild.name}** [${guild.id}]\nOwner: **${owner.tag}** [${owner.id}]\nUsers: **${usersOnGuild}**`
	};

	admin.send({ embeds: [embed] });
	if (!newsChannel) {
		const channel = guild.channels.cache.filter((c: any) => c.type == ChannelType.GuildText).first();
		if (channel.type != 0) return;
		channel.send('Welcome!');
		return;
	}

	if (newsChannel.type != 0)
		return;
	
	newsChannel.send('Welcome!');
	console.log('test');
});
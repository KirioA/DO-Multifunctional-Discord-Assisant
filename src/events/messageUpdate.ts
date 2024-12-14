import { Message } from 'discord.js';

client.on('messageUpdate', async (oldMessage: Message, newMessage: Message) => {
	if (!oldMessage.member?.user) return;
	if (oldMessage.member.user.bot) return;
	await log.add(`[${newMessage.channel.type != 1 ? newMessage.channel.name : 'none'}] [edit] ${oldMessage.author.tag}:\
		${oldMessage.content} ==> ${newMessage.content}`, newMessage.guild);
});
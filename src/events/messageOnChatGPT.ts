import { ChannelType, Message, TextChannel } from 'discord.js';
import { DB } from '../modules/database.js';
import { chatGPT } from '../modules/gptClient.js';

client.on('messageCreate', async (message: Message) => {
	if (message.author.bot) return;
	if (message.channel.type !== ChannelType.GuildText) return; // GUILD TEXT

	const MemGuild = await DB.getGuild(message.guild);
	const state_gpt = MemGuild.state_gpt;
	const channel_gpt = MemGuild.system_gpt.channel;

	if (!state_gpt ?? !channel_gpt) return;

	if (message.channel.type == 0 && message.channel.id == channel_gpt) {
		const channel = client.channels.cache.get(channel_gpt) as TextChannel;
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.find((wh) => wh.token);

		if (!webhook) {
			return channel.send('Не работает отправка по Webhook, проверьте настройки гильдии или пересоздайте приложение через настройки бота (/settings).');
		}

		const mes = await webhook.send('*Думаю над сообщением...*');
		const res = await chatGPT.sendMessage(message.content, {
			timeoutMs: 3 * 60000,
			conversationId: MemGuild.message_conversation_id,
			parentMessageId: MemGuild.message_parent_id
		});

		MemGuild.message_conversatio_id = res.conversationId;
		MemGuild.message_parent_id = res.parentMessageId;

		await mes.delete();

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < 10; i++) {
			const text = res.text.slice(1950 * i, 1950 * (i + 1));
			if (!text) return;

			// eslint-disable-next-line no-await-in-loop
			await webhook.send({
				content: `<@${message.author.id}>, ${i ? '...' : ''} ${text}`
			});
		}
	}
});
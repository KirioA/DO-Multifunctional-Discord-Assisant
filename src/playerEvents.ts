const { player } = client;

player.on('addSong', async (queue: any, song: any) => {
	await queue.textChannel.send({
		embeds: [{
			color: client.color,
			title: '<:queue:1085224494513279026> Очередь',
			description: `Трек **${song.name}** добавлен в очередь.`,
			footer: {
				text: `🎧 ${song.user.tag}`
			}
		}]
	});
});

player.on('finish', async (queue: any) => {
	await queue.textChannel.send({
		embeds: [{
			color: client.color,
			title: '<:queue:1085224494513279026> Очередь',
			description: 'В очереди не осталось треков и музыка закончилась.',
		}]
	});
});

player.on('playSong', async (queue: any, song: any) => {
	try {
		const exampleEmbed = {
			color: client.color,
			title: song.name,
			thumbnail: {
				url: song.thumbnail
			},
			fields: [
				{ name: 'Время', value: `${song.formattedDuration}`, inline: true },
				{ name: 'Битрейт', 
				  value: song.formats[0].audioBitrate ? `${song.formats[0].audioBitrate} kbps` : '192 kbps',
				  inline: true
				},
				{ name: 'Прослушиваний', value: `${song.views.toLocaleString()}`, inline: true }
			],
			footer: {
				text: `🎧 ${song.user.tag}`
			}
		};

		if (queue && queue.textChannel) {
			queue.textChannel.send({ embeds: [exampleEmbed] }).catch((e: any) => { console.error(e); });
		}
	} catch (e) {
		console.error(e);
	}
});

player.on('error', async (textChannel: any, e: any) => {
	if (textChannel) {
		await sendEmbed.info(textChannel, 'Ошибка', `Произошла ошибка: ${e}`);
		await bot.sendMessage(bot.chat, `Music Player Error:\n\n${e}\n\nCode: ${e.code}`);
	}
});

player.on('empty', async (queue: any) => {
	console.error(`DISTUBE PLAYER: empty event\n${queue}`);
	// await channel.send({
	// 	embeds: [{
	// 		color: client.color,
	// 		description: 'Голосовой канал пуст! Выхожу с канала.'
	// 	}]
	// });
});

player.on('searchNoResult', (message: any, query: any) => {
	bot.sendMessage(bot.chat, `SEARCH NO RESULT\n\n${JSON.stringify(query)}`);
});

export default {};
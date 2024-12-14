/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Guild } from 'discord.js';

client.on('ready', async () => {
	console.timeEnd('Start bot time');
	let serverList = `\nServers(${client.guilds.cache.size}):`;
	await client.guilds.cache.forEach((guild: Guild) => {
		serverList = serverList.concat('\n\t', `ID: ${guild.id}  Name: ${guild.name}`);
		// guild.commands.set([]); // Clear all guild command. Using ONLY global.
	});
	console.log(serverList);

	setInterval(() => {
		console.log(`[~] ${new Date().toLocaleDateString().slice(0, -5)} ${new Date().toLocaleTimeString()} | PING: ${Math.round(client.ws.ping)} ms`);
	}, 1800000);
	bot.sendMessage(bot.chat, `${DateNow()} - DJS14 STARTED!`);
});

function DateNow() {
	const date = new Date();
	const padTo2Digits = (num: number) => num.toString().padStart(2, '0');
	return (`${[date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-')} ${[padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes()), padTo2Digits(date.getSeconds())].join(':')}`);
}
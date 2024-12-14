/* eslint-disable no-var */
/* eslint-disable vars-on-top */

import {
	Client,
	GatewayIntentBits,
	Collection,
	Partials
} from 'discord.js';

import TelegramBotAPI from 'node-telegram-bot-api';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { YtDlpPlugin } from '@distube/yt-dlp';

import cfg from './config.json' assert { type: 'json' };

import('./modules/checkmoder.js');
import('./modules/log.js');
import('./modules/rankSystem.js');
import('./modules/senderEmbed.js');

console.time('Start bot time');

global.config = cfg;

global.bot = new TelegramBotAPI(config.token_telegram, { polling: true });
bot.chat = Number(cfg.adminTgChatId);
bot.adminId = Number(cfg.adminId);

global.client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildBans
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember,
		Partials.Reaction
	]
});

client.player = new DisTube(client, {
	searchSongs: 1,
	searchCooldown: 30,
	leaveOnStop: false,
	leaveOnFinish: false,
	leaveOnEmpty: true,
	emptyCooldown: 30,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: false,
	emitAddListWhenCreatingQueue: false,
	youtubeCookie: config.youtubeCookie,
	ytdlOptions: {
		highWaterMark: 1024 * 1024 * 32,
		quality: 'highestaudio',
		liveBuffer: 60000,
		dlChunkSize: 0,
		filter: 'audioonly'
	},
	plugins: [
		new SpotifyPlugin({
			parallel: true,
			emitEventsAfterFetching: true,
			api: {
				clientId: config.spotifyId,
				clientSecret: config.spotifySecret
			}
		}),
		new YtDlpPlugin({
			update: true
		})
	]
});

import('./playerEvents.js');

client.voiceTime = new Map();
client.commands = new Collection();
client.slashCommands = new Collection();
client.contextMenuCommands = new Collection();

client.color = 0x986AF0;
client.debug = false;

import('./handlers/command.js').then((m) => {
	m.default(client).catch((e) => console.error(e));
});
import('./handlers/events.js').then((m) => {
	m.default(client).catch((e) => console.error(e));
});
import('./handlers/slashCommand.js').then((m) => {
	m.default(client).catch((e) => console.error(e));
});

client.login(config.token);

process.on('unhandledRejection', (reason: any, promise: any) => {
	bot.sendMessage(bot.chat, `DJS14 unhandled error!\n\n${JSON.stringify(promise)}\n\nReason: ${reason}\n\nStack: ${reason.stack}`);
});
process.on("uncaughtException", async (err: any) => {
	bot.sendMessage(bot.chat, `DJS14 uncaughtException error!\n\n${JSON.stringify(err)}\n\nReason: ${err}\n\nStack: ${err.stack}`);
});
process.on("uncaughtExceptionMonitor", async (err: any) => {
	bot.sendMessage(bot.chat, `DJS14 uncaughtExceptionMonitor error!\n\n${JSON.stringify(err)}\n\nReason: ${err}\n\nStack: ${err.stack}`);
});

/* TODO: fix everything related to this */
client.namePermission = (perms: string) => {
	interface PFB { [key: string]: any, }
	const PermissionFlagsBits: PFB = {
		AddReactions: 'добавлять реакции на сообщения',
		Administrator: 'администратора',
		AttachFiles: 'прикреплять файлы и изображения',
		BanMembers: 'банить участников',
		ChangeNickname: 'изменять свой никнейм',
		Connect: 'подключатся к голосовому каналу',
		CreateInstantInvite: 'создавать мгновенные приглашения',
		CreatePrivateThreads: 'создавать приватные каналы',
		CreatePublicThreads: 'создавать публичные каналы',
		DeafenMembers: 'выключать звук участникам голосового канала',
		EmbedLinks: 'отправлять встроенные ссылки',
		KickMembers: 'выгонять участников',
		ManageChannels: 'управлять каналами',
		ManageEmojisAndStickers: 'управлять эмоджи и стикерами',
		ManageEvents: 'редактировать с событиями',
		ManageGuild: 'управлять сервером',
		ManageMessages: 'удалять сообщения других пользователей',
		ManageNicknames: 'изменять никнеймы пользователям',
		ManageRoles: 'создавать и редактиовать роли',
		ManageThreads: 'редактировать ветки',
		ManageWebhooks: 'управлять вебхуками',
		MentionEveryone: 'упоминать всех (everyone)',
		ModerateMembers: 'выдавать и снимать тайм-аут (подумать о своем поведении)',
		MoveMembers: 'перетаскивать участников',
		MuteMembers: 'заглушать участников голосового канала',
		PrioritySpeaker: 'отдавать приоритет в голосовом канале',
		ReadMessageHistory: 'читать историю сообщений',
		RequestToSpeak: 'запрашивать выступление на трибуне',
		SendMessages: 'отправлять сообщения',
		SendMessagesInThreads: 'отправлять сообщения в ветках',
		SendTTSMessages: 'отправлять TTS сообщения',
		Speak: 'говорить в голосовый каналах',
		Stream: 'транслировать виде в голосовых каналах',
		UseApplicationCommands: 'использовать команды приложения',
		UseEmbeddedActivities: 'использовать Activity в голосовм канале',
		UseExternalEmojis: 'отправлять эмоджи с других серверов',
		UseExternalStickers: 'отправлять стикеры с других серверов',
		UseVAD: 'использовать активацию по голосу',
		ViewAuditLog: 'просматривать журнал аудита',
		ViewChannel: 'просматривать каналы',
		ViewGuildInsights: 'просматривать информацию о гильдии'
	};

	return PermissionFlagsBits[perms];
};
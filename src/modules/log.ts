// eslint-disable-next-line import/no-import-module-exports
import { Guild, Channel } from 'discord.js';

import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const padTo2Digits = (num: any) => num.toString().padStart(2, '0');
const formatDate = (date: any) => ([
	padTo2Digits(date.getHours()),
	padTo2Digits(date.getMinutes()),
	padTo2Digits(date.getSeconds())
].join(':'));

const dirname = path.dirname(fileURLToPath(import.meta.url));

const logger = {
	add: async (text: string, guild: Guild) => {
		const nameFile = ((new Date()).toISOString().split('T')[0]);
		const datetime = `[${formatDate(new Date())}]`;
		const pathLogs = path.join(dirname, '../../logs/');
		if (!guild) {
			fs.appendFileSync(`${pathLogs}/${nameFile}.txt`, `\n${datetime} ${text}`);
			return;
		}
		const dir = `${pathLogs}/guilds/${guild.id}`;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		fs.appendFileSync(`${dir}/${nameFile}.txt`, `\n${datetime} ${text}`);
	}
};

global.log = logger;
// eslint-disable-next-line import/no-import-module-exports
import { Client } from 'discord.js';

import fs from 'fs';
import path from 'node:path';
import { Table } from 'console-table-printer';
import { fileURLToPath } from 'url';

const p = new Table({
	columns: [
		{ name: 'ChatCommand', alignment: 'center' },
		{ name: 's', alignment: 'center' }
	],
	colorMap: {
		custom_green: '\x1b[32m'
	}
});

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (client: Client) => {
	const commandFiles = fs.readdirSync(path.join(dirname, '../commands/chat'))
		.filter((file: any) => file.endsWith('.js'));

	// eslint-disable-next-line no-restricted-syntax
	for (const file of commandFiles) {
		// eslint-disable-next-line no-await-in-loop
		const cmdPath = path.join(import.meta.url, '../../commands/chat', `${file}`);

		try {
			// eslint-disable-next-line no-await-in-loop
			const command = (await import(cmdPath)).default;

			if (command.name == undefined) {
				p.addRow({ ChatCommand: 'Unknown', s: '-' }, { color: 'red' });
				continue;
			}

			client.commands.set(command.name, command);
			p.addRow({ ChatCommand: command.name, s: '+' }, { color: 'custom_green' });
		} catch (e) {
			console.log(e);
		}
	}

	p.printTable();
};
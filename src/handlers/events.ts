// eslint-disable-next-line import/no-import-module-exports
import { Client } from 'discord.js';

import fs from 'fs';
import path from 'node:path';
import { Table } from 'console-table-printer';
import { fileURLToPath } from 'url';

const p = new Table({
	columns: [
		{ name: 'Events', alignment: 'center' },
		{ name: 's', alignment: 'center' }
	],
	colorMap: {
		custom_green: '\x1b[32m'
	}
});

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (client: Client) => {
	const eventFiles = fs.readdirSync(path.join(dirname, '../events'))
		.filter((file: any) => file.endsWith('.js'));

	// eslint-disable-next-line no-restricted-syntax
	for (const file of eventFiles) {
		const eventsPath = path.join(import.meta.url, '../../events', `${file}`);

		try {
			// eslint-disable-next-line no-await-in-loop
			await import(eventsPath);

			p.addRow({ Events: file, s: '+' }, { color: 'custom_green' });
		} catch (e) {
			p.addRow({ Events: file, s: '-' }, { color: 'red' });
			console.log(e);
		}
	}

	p.printTable();
};
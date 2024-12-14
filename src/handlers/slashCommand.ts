// eslint-disable-next-line import/no-import-module-exports
import {
	Client, PermissionsBitField, REST, Routes
} from 'discord.js';
// eslint-disable-next-line import/no-import-module-exports

import fs from 'fs';
import path from 'node:path';
import { Table } from 'console-table-printer';
import { fileURLToPath } from 'url';

const p = new Table({
	columns: [
		{ name: 'SlashCommands', alignment: 'center' }, // with alignment and color
		{ name: 's', alignment: 'center' }
	],
	colorMap: {
		custom_green: '\x1b[32m'
	}
});

const v = new Table({
	columns: [
		{ name: 'ContextMenuCommands', alignment: 'center' }, // with alignment and color
		{ name: 's', alignment: 'center' }
	],
	colorMap: {
		custom_green: '\x1b[32m'
	}
});

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (client: Client) => {
	const allCommands: Array<any> = [];

	await loadSlashCommand(allCommands);
	await loadMenuCommand(allCommands);

	const rest = new REST({ version: '10' }).setToken(config.token);
	await (async () => {
		try {
			if (client.debug) {
				await rest.put(
					Routes.applicationGuildCommands(config.clientID, '974695530636673034'), // 974695530636673034
					{ body: allCommands }
				);
			} else {
				await rest.put(
					Routes.applicationCommands(config.clientID),
					{ body: allCommands }
				)
					.catch((er: any) => console.log(er));
			}
			console.log('Successfully reloaded application & slash (/) commands.');
		} catch (error) {
			console.log(error);
		}
	})();
};

async function loadSlashCommand(allCommands) {
	const commandFiles = fs.readdirSync(path.join(dirname, '../commands/slash'))
		.filter((file: any) => file.endsWith('.js'));

	// eslint-disable-next-line no-restricted-syntax
	for (const file of commandFiles) {
		const cmdPath = path.join(import.meta.url, '../../commands/slash', `${file}`);

		try {
			// eslint-disable-next-line no-await-in-loop
			const command = (await import(cmdPath)).default;

			if (!command) {
				p.addRow({ SlashCommands: 'Unknown', s: '-' }, { color: 'red' });
				continue;
			}

			allCommands.push({
				name:
					command.name,
				description:
					command.description,
				options:
					command.options ? command.options : null,
				default_permission:
					command.defaultPermission ? command.defaultPermission : null, // command.default_permission
				default_member_permissions:
					command.default_member_permissions ? PermissionsBitField.resolve(command.default_member_permissions)
						.toString() : null
			});

			client.slashCommands.set(command.name, command);
			p.addRow({
				SlashCommands: command.name,
				s: '+'
			}, { color: 'custom_green' });
		} catch (e) {
			console.log(e);
		}
	}

	p.printTable();
}

async function loadMenuCommand(allCommands) {
	const menuFiles = fs.readdirSync(path.join(dirname, '../commands/menu'))
		.filter((file: any) => file.endsWith('.js'));

	// eslint-disable-next-line no-restricted-syntax
	for (const file of menuFiles) {
		const cmdPath = path.join(import.meta.url, '../../commands/menu', `${file}`);

		try {
			// eslint-disable-next-line no-await-in-loop
			const command = (await import(cmdPath)).default;

			if (!command) {
				v.addRow({ ContextMenuCommands: 'Unknown', s: '-' }, { color: 'red' });
				continue;
			}

			allCommands.push({
				name: command.name,
				type: command.type
			});

			client.contextMenuCommands.set(command.name, command);
			v.addRow({ ContextMenuCommands: command.name, s: '+' }, { color: 'custom_green' });
		} catch (e) {
			console.log(e);
		}
	}

	v.printTable();
}
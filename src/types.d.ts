/* eslint-disable no-shadow */
import {
	Collection,
	Message,
	Client
} from 'discord.js';

declare module 'discord.js' {
	export interface Client {
		slashCommands: Collection<string, SlashCommand>
		commands: Collection<string, Command>,
		contextMenuCommands: Collection<string, Command>,
		debug: boolean,
		color: number,
		Memory: any,
		player: any,
		voiceTime: Map<any, any>,
		namePermission: Function

	}
	export interface Message {
		args: Array<string>
	}

	export interface GuildMember {
		memory: any
	}
}

declare module 'simple-discord.db';

type SlashOptions = {
	name: string,
	description: string,
	type: number,
	required: boolean,
	choices?: Array<Object>
}

export interface SlashCommand {
	name: string,
	description: string,
	options?: Array<SlashOptions>,
	defaultPermission: boolean,
	default_member_permissions?: any,
	userPerms?: Array<any>,
	botPerms?: Array<any>,
	cooldown?: number,
	type?: number,
	run: (client: Client, interaction: ChatInputCommandInteraction) => void
}

export interface MenuCommand {
	name: string,
	type: number,
	run: (client: Client, interaction : any /* ContextMenuCommandInteraction */) => void
}

export interface Command {
	name: string,
	description: string,
	userPerms?: Array<any>,
	botPerms?: Array<any>,
	run: (client: Client, message: Message) => void,
}
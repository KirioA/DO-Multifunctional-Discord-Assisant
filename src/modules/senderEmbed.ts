global.sendEmbed = {
	error: async (orig: any, message: string, header?: string) => {
		await orig.reply({
			embeds: [{
				// color: client.color,
				color: 0x2f3136,
				title: header,
				description: `<:xmark:1033743397644681338>  ${message}`
			}],
			ephemeral: true
		});
	},
	info: async (orig: any, header: string, message: string, inputColor: number = client.color) => {
		const msg = {
			embeds: [{
				color: inputColor,
				title: header,
				description: message
			}]
		};

		if (orig.reply) {
			await orig.reply(msg);
			return;
		}

		await orig.send(msg);
	},
	custom: async (
		header: string,
		message: string,
		inputFooterText: string,
		inputColor: number = client.color
	) => ({
		color: inputColor,
		title: header,
		description: message,
		footer: { text: inputFooterText }
	})
};

export default {};
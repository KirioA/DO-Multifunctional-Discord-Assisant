import { ChatGPTAPI } from 'chatgpt';

// eslint-disable-next-line import/no-mutable-exports,import/prefer-default-export
export const chatGPT = new ChatGPTAPI({
	apiKey: config.OPEN_AI,
	debug: true,
	completionParams: {
		model: 'gpt-3.5-turbo-0613',
		temperature: 0.8,
		top_p: 1.0,
		max_tokens: 2048
	},
	systemMessage: `You are DO GPT, a large language model trained by OpenAI, integrated into the app "DO". You answer as informative and concise as possible for each response. If you are generating a list, do not have too many items.
Current date: ${new Date().toISOString()}\n\n`
});

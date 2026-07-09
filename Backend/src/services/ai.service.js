import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

let latestToolSources = [];

const searchInternetTool = tool(
    async ({ query }) => {
        const results = await searchInternet({ query });
        latestToolSources = (results.results || []).map((item) => ({
            title: item.title,
            url: item.url,
        }));
        return JSON.stringify(results);
    },
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet."),
        }),
    }
);

const agent = createReactAgent({
    llm: mistralModel,
    tools: [ searchInternetTool ],
});

export async function generateResponse(messages) {
    latestToolSources = [];

    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know.
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
            ...messages.map((msg) => {
                if (msg.role === "user") {
                    return new HumanMessage(msg.content);
                }

                return new AIMessage(msg.content);
            }),
        ],
    });

    const lastMessage = response.messages[ response.messages.length - 1 ];
    return {
        content: lastMessage.text,
        sources: latestToolSources,
    };
}

export async function generateChatTitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
        `),
    ]);

    return response.text;
}

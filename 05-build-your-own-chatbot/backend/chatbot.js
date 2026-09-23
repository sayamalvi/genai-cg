import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";
import NodeCache from "node-cache";
dotenv.config({ path: '../../.env' });

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 })
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8)

const systemMessage = {
    role: "system",
    content: ` You are a smart personal assistant.
        If you know the answer to a question, answer it directly in plain english.dd
        If the answer requires real-time, local, or up-to-date information, or if you don't know the answer, use the available tools.
        You have the following tool:
        1. searchWeb({query}: {query:string}) //Search the latet information and realtime data on the internet 
    
        Decide when to use your own knowledge and when to use the tool.
        Do not mention the tool unless needed.

        Examples:
        Q: What is the capital of France?
        A: The capital of France is Paris.

        Q: What is the current weather in New York?
        A: I need to check the weather for you. \n webSearch({query:"current weather in New York"})

        Q: Who is the Prime Minister of India ?
        A: The current prime minister of india is Narendra Podi.

        Q: Tell me the latest AI News.
        A: webSearch({query:"latest AI news"})

        Current date and time: ${new Date().toUTCString()}
        `,
};

export async function generate(userMessage, threadId) {
    const baseMessage = [systemMessage, { role: "user", content: userMessage }];
    const messages = cache.get(threadId) ?? baseMessage;
    while (true) {
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "webSearch",
                        description:
                            "Search the latest information and realtime data on the internet",
                        parameters: {
                            type: "object",
                            properties: {
                                query: {
                                    type: "string",
                                    description: "The search query to perform search on",
                                },
                            },
                            required: ["query"],
                        },
                    },
                },
            ],
            tool_choice: "auto",
            temperature: 0,
        });
        messages.push(completion.choices[0].message);
        const toolCalls = completion.choices[0].message.tool_calls;

        if (!toolCalls) {
            cache.set(threadId, messages)
            return completion.choices[0].message.content;
        }

        for (const tool of toolCalls) {
            const functionName = tool.function.name;
            const functionParams = tool.function.arguments;

            if (functionName === "webSearch") {
                const result = await webSearch(JSON.parse(functionParams));
                messages.push({
                    tool_call_id: tool.id,
                    role: "tool",
                    name: functionName,
                    content: result,
                });
            }
        }
    }
}
async function webSearch({ query }) {
    console.log("Calling web search");
    const response = await tvly.search(query, { maxResults: 1 });
    const finalResult = response.results.map((res) => res.content).join("\n\n");
    return finalResult;
}

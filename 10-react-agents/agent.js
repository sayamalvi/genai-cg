import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import z from "zod";
import readline from "node:readline/promises";
import { MemorySaver } from "@langchain/langgraph";

async function main() {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
  });

  const search = new TavilySearch({
    maxResults: 3,
    topic: "general",
  });

  const calendarEvents = tool(
    ({ query }) => {
      return JSON.stringify([
        { title: "Office call", time: "2PM", location: "GMeet" },
      ]);
    },
    {
      name: "get-calendar-events",
      description: "Call to get the calendar events",
      schema: z.object({
        query: z.string().describe("Search terms to look for"),
      }),
    },
  );

  const checkpointer = new MemorySaver();
  const agent = createReactAgent({
    llm: model,
    tools: [search, calendarEvents],
    checkpointer,
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userQuery = await rl.question("You: ");
    if (userQuery === "/bye") break;

    const result = await agent.invoke(
      {
        messages: [
          {
            role: "system",
            content: `You are a personal assistant. use provided tools to get the information if you don't have have it. current date and time ${new Date().toUTCString()}`,
          },
          {
            role: "user",
            content: userQuery,
          },
        ],
      },
      { configurable: { thread_id: 'conversation-1' } },
    );

    console.log(
      "Assistant:",
      result.messages[result.messages.length - 1].content,
    );
  }
  rl.close();
}

main();

import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import readline from "node:readline/promises";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const messages = [
  {
    role: "system",
    content: `You are a smart personal assistant who answers the asked question. 
        You have access to the following tools:
        1. searchWeb({query}: {query:string}) //Search the latet information and realtime data on the internet 
        Current  date time: ${new Date().toUTCString()}
        `,
  },
];
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  while (true) {
    const quest = await rl.question("You: ");
    if (quest === "bye") break;
    messages.push({ role: "user", content: quest });

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
        console.log(completion.choices[0].message.content);
        break;
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
  rl.close()
}
async function webSearch({ query }) {
  console.log("Calling web search");
  const response = await tvly.search(query, { maxResults: 1 });
  const finalResult = response.results.map((res) => res.content).join("\n\n");
  return finalResult;
}
main();

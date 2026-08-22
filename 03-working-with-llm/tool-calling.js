import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function main() {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `You are a smart personal assistant who answers the asked question. 
        You have access to the following tools:
        1. searchWeb({query}: {query:string}) //Search the latet information and realtime data on the internet 
        `,
      },
      {
        role: "user",
        content: "when was iphone 16 launched ?",
      },
    ],
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
  const toolCalls = completion.choices[0].message.tool_calls;

  if (!toolCalls) {
    console.log(`Assistant: ${completion.choices[0].message.content}`);
  }

  for (const tool of toolCalls) {
    console.log("tool: ", tool);
    const functionName = tool.function.name;
    const functionParams = tool.function.arguments;

    if (functionName === "webSearch") {
      const result = await webSearch(JSON.parse(functionParams));
      console.log("Tool result");
    }
  }
}
main();
async function webSearch({ query }) {
  console.log("Calling web search");

  return "Iphone was launched on 20 september 2024";
}

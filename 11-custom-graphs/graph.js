import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import z from "zod";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph"; /**

 * 1. bring llm
 * 2. build the graph
 * 3. invoke the agent
 * 4. add the memory
 */

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

const tools = [search, calendarEvents];
const toolNode = new ToolNode(tools);

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);

async function callModel(state) {
  console.log("calling llm");
  const response = await llm.invoke(state.messages);
  return { messages: [response] };
}

function shouldContinue(state) {
  console.log("messages: ", state);
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage.tool_calls.length) {
    return "tools";
  }
  return "__end__";
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("llm", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "llm")
  .addEdge("tools", "llm")
  .addConditionalEdges("llm", shouldContinue);

const app = graph.compile();

async function main() {
  const result = await app.invoke({
    messages: [
      { role: "user", content: "what is the current weather in moscow" },
    ],
  });
  const messages = result.messages;
  const final = messages[messages.length - 1];

  console.log("AI:", final.content);
}

main();

import { ChatGroq } from "@langchain/groq";
import { createEvent, getEvents } from "./tools";
import {
  END,
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AIMessage } from "@langchain/core/messages";
import readline from "node:readline/promises";
import { stdout } from "node:process";

const tools = [createEvent, getEvents];

const assistant = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await assistant.invoke(state.messages);
  return { messages: [response] };
}

const toolNode = new ToolNode(tools);

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  if (lastMessage?.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("assistant", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "assistant")
  .addEdge("tools", "assistant")
  .addConditionalEdges("assistant", shouldContinue, {
    __end__: END,
    tools: "tools",
  });

const checkpointer = new MemorySaver();

const app = graph.compile({ checkpointer });

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: stdout,
  });

  let config = { configurable: { thread_id: "1" } };

  while (true) {
    const userInput = await rl.question("You: ");
    if (userInput === "/bye") break;
    const result = await app.invoke(
      {
        messages: [
          {
            role: "user",
            content: userInput,
          },
        ],
      },
      config,
    );
    console.log("AI: ", result.messages[result.messages.length - 1]?.content);
  }
  rl.close();
}

main();

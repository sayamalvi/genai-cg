import { ChatGroq } from "@langchain/groq";
import { createEvent, getEvents } from "./tools";
import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { AIMessage } from "@langchain/core/messages";

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

const app = graph.compile();

async function main() {
  const result = await app.invoke({
    messages: [
      {
        role: "user",
        content: `
      Create a Google Calendar event titled "Design Discussion"
      for today at 7:00 PM India time.
      Invite test (sayamalvi07@gmail.com).
      Set the duration to 30 minutes.
      Use the create-event tool.
    `,
      },
    ],
  });
  console.log("AI: ", result.messages[result.messages.length - 1]?.content);
}

main();

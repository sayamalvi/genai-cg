import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { writeFileSync } from "node:fs";

function validateUser(state) {
  console.log("Validating user details...");
  return state;
}

function createAccount(state) {
  console.log("Creating user account...");
  return state;
}

function sendVerificationEmail(state) {
  console.log("Sending verification email...");
  return state;
}

function verifyEmail(state) {
  console.log("Verifying email...");
  return state;
}

function whereToGo() {
  if (true) {
    return "__end__";
  } else return "sendVerificationEmail";
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("validateUser", validateUser)
  .addNode("createAccount", createAccount)
  .addNode("sendVerificationEmail", sendVerificationEmail)
  .addNode("verifyEmail", verifyEmail)
  .addEdge("__start__", "validateUser")
  .addEdge("validateUser", "createAccount")
  .addEdge("createAccount", "sendVerificationEmail")
  .addEdge("sendVerificationEmail", "verifyEmail")
  .addConditionalEdges("verifyEmail", whereToGo, {
    "__end__": END,
    "sendVerificationEmail": "sendVerificationEmail"
  });

const userRegistrationProcess = graph.compile();

async function main() {
  const finalState = await userRegistrationProcess.invoke({
    messages: [],
  });
  const drawableGraph = await userRegistrationProcess.getGraphAsync();
  const graphStateImage = await drawableGraph.drawMermaidPng();
  const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

  const filePath = "./userRegistrationState.png";
  writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));

  console.log("final", finalState);
}

main();
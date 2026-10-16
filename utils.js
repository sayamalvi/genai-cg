import { writeFileSync } from "node:fs";

export async function printGraph(agent, graphPath) {
  const drawableGraph = await agent.getGraphAsync();
  const graphStateImage = await drawableGraph.drawMermaidPng();
  const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

  writeFileSync(graphPath, new Uint8Array(graphStateArrayBuffer));
}

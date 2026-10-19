import { tool } from "@langchain/core/tools";
import z from "zod";

export const createEvent = tool(
  () => {
    return "the meeting has been created";
  },
  {
    name: "create-event",
    description: "Call to create the calendar events",
    schema: z.object({
      query: z.string().describe("Query for getting events"),
    }),
  },
);

export const getEvents = tool(
  () => {
    return JSON.stringify([
      {
        title: "Meeting with Sujoy",
        date: "19th October 2026",
        time: "2 PM",
        location: "Gmeet",
      },
    ]);
  },
  {
    name: "get-events",
    description: "Call to get the calendar events",
    schema: z.object({
      query: z.string().describe("Query for getting events"),
    }),
  },
);

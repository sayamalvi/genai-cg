import { tool } from "@langchain/core/tools";
import z from "zod";

export const createEvent = tool(
  () => {
    return "the meeting has been created"
  },
  {
    name: "create-event",
    description: "Call to create the calendar events",
    schema: z.object({}),
  },
);

export const getEvents = tool(
  () => {
    return JSON.stringify([
        {
            title: 'Meeting with Sujoy',
            date: '9th Aug 2025',
            time: '2 PM',
            location: 'Gmeet'
        }
    ])
  },
  {
    name: "get-events",
    description: "Call to get the calendar events",
    schema: z.object({}),
  },
);

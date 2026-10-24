import { tool } from "@langchain/core/tools";
import { google } from "googleapis";
import z from "zod";
import { oauth2Client } from "./server";
import tokens from "./tokens.json";

oauth2Client.setCredentials(tokens);
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

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

type Params = {
  q: string;
  timeMin: string;
  timeMax: string;
};

export const getEvents = tool(
  async (params: Params) => {
    console.log(params);
    const { q, timeMin, timeMax } = params;
    try {
      const response = await calendar.events.list({
        calendarId: "primary",
        q,
        timeMax,
        timeMin,
      });
      const result = response.data.items?.map((event) => {
        return {
          id: event.id,
          summary: event.summary,
          status: event.status,
          organizer: event.organizer,
          start: event.start,
          end: event.end,
          attendees: event.attendees,
          meetingLink: event.hangoutLink,
        };
      });
      return JSON.stringify(result)
    } catch (error) {
      console.log(error);
    }
    return "Failed to connect to the calendar"
  },
  {
    name: "get-events",
    description: "Call to get the calendar events",
    schema: z.object({
      q: z
        .string()
        .describe(
          "The query to be used to get events from google calendar. It can be one of these values: summary, description, location, attendees display name, attendees email, organiser\'s name, organiser\'s email",
        ),
      timeMin: z
        .string()
        .describe("The from datetime in UTC format for the event"),
      timeMax: z
        .string()
        .describe("The to datetime in UTC format for the event"),
    }),
  },
);

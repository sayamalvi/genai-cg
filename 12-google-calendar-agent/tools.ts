import { tool } from "@langchain/core/tools";
import { google } from "googleapis";
import z from "zod";
import { oauth2Client } from "./server";
import tokens from "./tokens.json";

oauth2Client.setCredentials(tokens);
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

type attendee = {
  email: string;
  displayName: string;
};

type EventData = {
  summary: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: attendee[];
};

export const createEvent = tool(
  async (eventData: EventData) => {
    const { summary, start, end, attendees } = eventData;
    const res = await calendar.events.insert({
      calendarId: "primary",
      sendUpdates: "all",
      requestBody: {
        summary,
        start,
        end,
        attendees,
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
      conferenceDataVersion: 1,
    });
    const event = res.data;
    return JSON.stringify({
      success: true,
      id: event.id,
      summary: event.summary,
      start: event.start,
      end: event.end,
      attendees: event.attendees,
      meetingLink: event.hangoutLink,
      eventLink: event.htmlLink,
      conferenceData: event.conferenceData,
    });
  },
  {
    name: "create-event",
    description: "Call to create the calendar events",
    schema: z.object({
      summary: z.string().describe("The title of the calendar event"),
      start: z.object({
        dateTime: z.string().describe("The date time of start of the event"),
        timeZone: z.string().describe("Current IANA timezone string"),
      }),
      end: z.object({
        dateTime: z.string().describe("The date time of end of the event"),
        timeZone: z.string().describe("Current IANA timezone string"),
      }),
      attendees: z
        .array(
          z.object({
            email: z.string().email().describe("Email address of the attendee"),
            displayName: z.string().describe("Name of the attendee"),
          }),
        )
        .describe(
          "People invited to the event; use an empty array if there are no attendees",
        ),
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
      return JSON.stringify(result);
    } catch (error) {
      console.log(error);
    }
    return "Failed to connect to the calendar";
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
        .describe("The from datetime to get events"),
      timeMax: z
        .string()
        .describe("The to datetime to get events"),
    }),
  },
);

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are ReviewAI, a smart review grader. Your task is to analyse given review and return the sentiment. Classify the revview as positive, neutral or negative. Output must be a single word",
      },
      {
        role: "user",
        content: `Review: These headphones arrived quickly and look great, but the left earcup stopped working after few days. 
        Sentiment: 
        `,
      },
    ],
  });
  console.log(completion.choices[0].message.content);
}
main();

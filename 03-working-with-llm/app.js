import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are ReviewAI, a smart review grader. Your task is to analyse given review and return the sentiment. Classify the revview as positive, neutral or negative. Output must be a single word. You must return result in valid JSON structure. 
          Ex: {"sentiment": "Negative"}
          `,
      },
      {
        role: "user",
        content: `Review: These headphones arrived quickly and look great, but the left earcup stopped working after few days. 
        Sentiment: 
        `,
      },
    ],
    temperature: 0,
    // top_p: 0.1,
    // stop: 'ga',
    // max_completion_tokens: 1000,
    // frequency_penalty: 1,
  });
  console.log(completion.choices[0].message.content);
}
main();

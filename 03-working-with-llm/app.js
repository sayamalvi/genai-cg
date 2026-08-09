import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are an ai assistant called TrashAI" },
      { role: "user", content: "who are you ? who built you" },
    ],
  });
  console.log(completion.choices[0].message);
}
main();

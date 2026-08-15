import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an interview grader assistant. Your task is to generate candidate evaluation score. Output must be following JSON structure.
        {
            "confidence": number (1-10 scale),
            "accuracy": number (1-10 scale), 
            "pass": boolean (true or false)
        }
        The response must: 
            1. Include ALL fields shown above
            2. Use only the exact data types specified
            3. Follow the exact data types specified
            4. Contain ONLY the JSON object and nothing else 
          `,

      },
      {
        role: "user",
        content: `
        Q. What does === do in javascript ?
        A. It checks strict equality-both type and value must match

        Q. How do you create a promise that resolves after 1 second
        A. const p = new Promise(r=>setTimeout(r, 1000))
        `,
      },
    ],
    temperature: 0,
    // top_p: 0.1,
    // stop: 'ga',
    // max_completion_tokens: 1000,
    // frequency_penalty: 1,
    response_format: { type: "json_object" },
  });
  console.log(completion.choices[0].message.content);
}
main();

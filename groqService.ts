import Groq from "groq-sdk";
import { Question } from "./types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, dangerouslyAllowBrowser: true });

export async function fetchQuestions(topic: string, count: number): Promise<Question[]> {
  // We fetch in batches of 10 to maintain quality and avoid timeouts
  const batchSize = 10;
  const numBatches = Math.ceil(count / batchSize);
  let allQuestions: Question[] = [];

  const prompt = `Generate ${batchSize} unique, challenging English grammar multiple choice questions for the topic: "${topic}". 
  Each question must have exactly 4 options. 
  The questions should range from intermediate to advanced difficulty.
  Provide a "hint" for each question that gives a small clue about the grammar rule involved without directly giving away the answer.
  
  Return ONLY a JSON object with a single key "questions" containing an array of these questions.
  Example structure:
  {
    "questions": [
      {
        "question": "The grammar question text.",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswerIndex": 0,
        "explanation": "A clear explanation.",
        "hint": "A helpful clue."
      }
    ]
  }`;

  try {
    for (let i = 0; i < numBatches; i++) {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        response_format: { type: "json_object" }
      });

      const jsonStr = completion.choices[0]?.message?.content;
      if (jsonStr) {
        const parsed = JSON.parse(jsonStr);
        if (parsed.questions && Array.isArray(parsed.questions)) {
            allQuestions = [...allQuestions, ...parsed.questions];
        } else if (Array.isArray(parsed)) {
            allQuestions = [...allQuestions, ...parsed];
        }
      }
      
      if (allQuestions.length >= count) break;
    }

    return allQuestions.slice(0, count);
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

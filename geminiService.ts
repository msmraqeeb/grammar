
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchQuestions(topic: string, count: number): Promise<Question[]> {
  // We fetch in batches of 10 to maintain quality and avoid timeouts
  const batchSize = 10;
  const numBatches = Math.ceil(count / batchSize);
  let allQuestions: Question[] = [];

  const prompt = `Generate ${batchSize} unique, challenging English grammar multiple choice questions for the topic: "${topic}". 
  Each question must have exactly 4 options. 
  The questions should range from intermediate to advanced difficulty.
  Provide a "hint" for each question that gives a small clue about the grammar rule involved without directly giving away the answer.`;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: 'The grammar question text.' },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'Exactly 4 multiple choice options.'
        },
        correctAnswerIndex: { 
          type: Type.INTEGER, 
          description: 'The index of the correct answer (0-3).'
        },
        explanation: { 
          type: Type.STRING, 
          description: 'A clear explanation of why the correct answer is right and others are wrong.'
        },
        hint: {
          type: Type.STRING,
          description: 'A helpful but subtle clue relating to the grammar rule.'
        }
      },
      required: ['question', 'options', 'correctAnswerIndex', 'explanation', 'hint']
    }
  };

  try {
    for (let i = 0; i < numBatches; i++) {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.8,
        }
      });

      const jsonStr = result.text;
      if (jsonStr) {
        const batch = JSON.parse(jsonStr) as Question[];
        allQuestions = [...allQuestions, ...batch];
      }
      
      if (allQuestions.length >= count) break;
    }

    return allQuestions.slice(0, count);
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

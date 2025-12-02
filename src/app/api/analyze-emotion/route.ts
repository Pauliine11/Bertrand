import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// Note: On the server side, we don't need dangerouslyAllowBrowser: true
// We try to use the standard OPENAI_API_KEY first, then fall back to the public one if needed
const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_KEY;

const client = new OpenAI({
  apiKey: apiKey,
});

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an emotion classifier. Return ONLY JSON with fields: " +
            "{emotion: string, valence: 'positive' | 'neutral' | 'negative', " +
            "intensity: 'low' | 'medium' | 'high', confidence: number (0-1)}. " +
            "Common emotions: Joie, Tristesse, Colère, Peur, Surprise, Dégoût, Neutre, Curiosité, Frustration, Enthousiasme."
        },
        {
          role: "user",
          content: `Classify the emotion in this text: "${text}"`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response safely
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      // Fallback in case of malformed JSON (though response_format should prevent this)
      analysis = {
        emotion: "Inconnu",
        valence: "neutral",
        intensity: "low",
        confidence: 0
      };
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Emotion Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze emotion' },
      { status: 500 }
    );
  }
}


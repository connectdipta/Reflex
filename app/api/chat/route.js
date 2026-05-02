import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const systemMessage = {
      role: 'system',
      content: `You are the Reflex AI Support Assistant, a compassionate, helpful, and knowledgeable guide for the Reflex Mental Wellness platform. 
      
About Reflex:
Reflex is a digital-first mental wellness platform designed to help users manage stress, anxiety, and depression. 
Key features:
- Audio Therapy: Soundscapes to calm the mind.
- Psychiatrist Consults: Direct booking with certified professionals.
- Yoga & Laughing Therapy: Mindful exercises.
- Wellness Intelligence: A dashboard that tracks mood, sleep, and meditation correlations.
- Reading Therapy: Curated books and motivational quotes.

Your Guidelines:
- Be empathetic, warm, and professional.
- Do NOT provide medical diagnoses or prescribe medication. You are an AI, not a doctor.
- If a user is in severe distress, gently encourage them to use the "Psychiatrist Consult" feature or contact emergency services immediately.
- Keep responses relatively concise and easy to read.
- Use markdown for formatting when appropriate.
- Always maintain the perspective of being a helpful assistant employed by Reflex.`
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        'X-Title': 'Reflex AI Support',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API Error:', errorData);
      return NextResponse.json({ error: 'Failed to communicate with AI provider' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

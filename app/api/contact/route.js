import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // In production, you could save to DB or send email here
    console.log('Contact form submission:', { name, email, phone, message });

    return NextResponse.json(
      { message: 'Message sent successfully! We will get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

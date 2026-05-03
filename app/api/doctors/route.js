import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    await connectDB();
    const doctors = await User.find({ role: 'doctor' })
      .select('name avatar email doctorProfile')
      .sort({ createdAt: -1 });

    return NextResponse.json({ doctors });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch user tracking data
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.userId).select('trackingData wellnessProfile name');
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({ trackingData: user.trackingData, wellnessProfile: user.wellnessProfile, name: user.name });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST: Update tracking when user uses a service
export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    const { service, mood, sleep, meditation, energy } = await request.json();

    await connectDB();
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    // Update session count
    user.trackingData.totalSessions += 1;
    user.trackingData.lastActive = new Date();

    // Update service-specific count
    if (service && user.trackingData.servicesUsed[service] !== undefined) {
      user.trackingData.servicesUsed[service] += 1;
    }

    // Add mood history entry
    if (mood) {
      user.trackingData.moodHistory.push({ mood, date: new Date() });
      // Keep only last 30 entries
      if (user.trackingData.moodHistory.length > 30) {
        user.trackingData.moodHistory = user.trackingData.moodHistory.slice(-30);
      }
    }

    // Add weekly stat
    if (mood || sleep || meditation || energy) {
      const today = new Date();
      const weekLabel = `${today.getMonth() + 1}/${today.getDate()}`;
      user.trackingData.weeklyStats.push({
        week: weekLabel,
        mood: mood || 50,
        sleep: sleep || 50,
        meditation: meditation || 0,
        energy: energy || 50,
      });
      // Keep only last 14 entries
      if (user.trackingData.weeklyStats.length > 14) {
        user.trackingData.weeklyStats = user.trackingData.weeklyStats.slice(-14);
      }
    }

    await user.save();

    return NextResponse.json({ message: 'Tracking updated', trackingData: user.trackingData });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

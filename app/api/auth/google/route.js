import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, avatar, firebaseUid } = await request.json();

    if (!email || !firebaseUid) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let isNewUser = false;
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update Firebase UID if not set
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        user.authProvider = 'google';
        if (avatar && !user.avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      // Create new user
      isNewUser = true;
      user = new User({
        name: name || 'User',
        email: email.toLowerCase(),
        firebaseUid,
        authProvider: 'google',
        avatar: avatar || '',
        role: 'user',
      });
      await user.save();
    }

    const token = signToken({ userId: user._id, role: user.role });

    return NextResponse.json({
      message: 'Login successful',
      token,
      isNewUser,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        wellnessProfile: user.wellnessProfile,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

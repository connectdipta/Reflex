import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password, avatar, wellnessProfile } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      avatar: avatar || '',
      authProvider: 'email',
      wellnessProfile: wellnessProfile || {},
    });
    await user.save();

    const token = signToken({ userId: user._id, role: user.role });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          wellnessProfile: user.wellnessProfile,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

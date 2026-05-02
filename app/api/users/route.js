import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Get all users (admin) or single user profile
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    await connectDB();

    // Admin or Doctor: fetch all users
    if (decoded.role === 'admin' || decoded.role === 'doctor') {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      return NextResponse.json({ users });
    }

    // Regular user: fetch own profile
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PATCH: Update user role (admin) or update own profile
export async function PATCH(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    await connectDB();

    // Admin: update user role
    if (decoded.role === 'admin' && body.targetUserId && body.newRole) {
      const user = await User.findById(body.targetUserId);
      if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

      user.role = body.newRole;
      await user.save();
      return NextResponse.json({ message: `User role updated to ${body.newRole}` });
    }

    // Self: update profile
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    if (body.name) user.name = body.name;
    if (body.avatar) user.avatar = body.avatar;
    if (body.wellnessProfile) user.wellnessProfile = { ...user.wellnessProfile, ...body.wellnessProfile };

    await user.save();
    return NextResponse.json({
      message: 'Profile updated',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, wellnessProfile: user.wellnessProfile },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete user (admin only)
export async function DELETE(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    await connectDB();
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    if (!userId) return NextResponse.json({ message: 'User ID required' }, { status: 400 });

    await connectDB();
    await User.findByIdAndDelete(userId);
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

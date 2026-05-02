import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// POST: Apply to become a doctor
export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    const { specialization, degree, experience, hospital, bio, fee, availableDays, image } = await request.json();

    if (!specialization || !degree) {
      return NextResponse.json({ message: 'Specialization and degree are required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    if (user.role === 'doctor') {
      return NextResponse.json({ message: 'You are already registered as a doctor' }, { status: 400 });
    }

    user.doctorProfile = {
      specialization,
      degree,
      experience: experience || 0,
      hospital: hospital || '',
      bio,
      fee: fee || 0,
      image: image || '',
      availableDays: availableDays || [],
      status: 'pending',
    };
    await user.save();

    return NextResponse.json({ message: 'Application submitted successfully! We will review it shortly.' }, { status: 201 });
  } catch (error) {
    console.error('Doctor apply error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// GET: Get all doctor applications (admin only)
export async function GET(request) {
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

    await connectDB();
    const applications = await User.find({ 'doctorProfile.degree': { $ne: '' } })
      .select('name email avatar doctorProfile createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PATCH: Approve/Reject doctor application (admin only)
export async function PATCH(request) {
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

    const { userId, action } = await request.json();
    if (!userId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    if (action === 'approve') {
      user.role = 'doctor';
      user.doctorProfile.status = 'approved';
    } else {
      user.doctorProfile.status = 'rejected';
    }
    await user.save();

    return NextResponse.json({ message: `Application ${action}d successfully` });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

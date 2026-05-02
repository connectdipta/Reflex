import connectDB from '@/lib/connectDB';
import Content from '@/models/Content';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch content (public for users, all for admin)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const filter = { isActive: true };
    if (type) filter.type = type;

    const content = await Content.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST: Create content (admin only)
export async function POST(request) {
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

    const body = await request.json();
    const { type, title, description, url, link, thumbnail, duration, tag, author } = body;

    if (!type || !title) {
      return NextResponse.json({ message: 'Type and title are required' }, { status: 400 });
    }

    await connectDB();
    const content = new Content({
      type, title, description, url, link, thumbnail, duration, tag, author,
      addedBy: decoded.userId,
    });
    await content.save();

    return NextResponse.json({ message: 'Content added', content }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// DELETE: Remove content (admin only)
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
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Content ID required' }, { status: 400 });

    await connectDB();
    await Content.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Content deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

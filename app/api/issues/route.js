import connectDB from '@/lib/connectDB';
import Issue from '@/models/Issue';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

// POST: Submit a new issue
export async function POST(request) {
  try {
    const { name, email, subject, message, screenshot } = await request.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connectDB();
    
    // Optional: Get userId from token if logged in
    let userId = null;
    const token = getTokenFromRequest(request);
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) userId = decoded.userId;
    }

    const newIssue = new Issue({
      userId,
      name,
      email,
      subject,
      message,
      screenshot,
    });

    await newIssue.save();
    return NextResponse.json({ message: 'Issue reported successfully. Thank you!' }, { status: 201 });
  } catch (error) {
    console.error('Issue submission error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// GET: List all issues (Admin only)
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const issues = await Issue.find().sort({ createdAt: -1 });
    return NextResponse.json({ issues });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PATCH: Update issue status (Admin only)
export async function PATCH(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { issueId, status } = await request.json();
    if (!issueId || !['pending', 'fixed'].includes(status)) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    await connectDB();
    const issue = await Issue.findByIdAndUpdate(issueId, { status }, { new: true });
    if (!issue) return NextResponse.json({ message: 'Issue not found' }, { status: 404 });

    return NextResponse.json({ message: `Issue marked as ${status}`, issue });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete an issue (Admin only)
export async function DELETE(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    await connectDB();
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const issueId = searchParams.get('id');
    if (!issueId) return NextResponse.json({ message: 'Issue ID required' }, { status: 400 });

    await connectDB();
    await Issue.findByIdAndDelete(issueId);
    return NextResponse.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

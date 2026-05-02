import connectDB from '@/lib/connectDB';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'Confirmed' });
    const totalUsers = await User.countDocuments();

    return NextResponse.json({
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      totalUsers,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

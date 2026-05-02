import connectDB from '@/lib/connectDB';
import Appointment from '@/models/Appointment';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ message: 'Error fetching appointments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, date, time, service, doctor, message } = body;

    if (!name || !email || !phone || !date || !time || !doctor) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    const appointment = new Appointment({ 
      name, email, phone, date, time, service, doctor, message,
      userId: body.userId || null
    });
    await appointment.save();

    return NextResponse.json(
      { message: 'Appointment booked successfully', data: appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ message: 'Error saving appointment' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, status, meetLink, doctorResponse } = body;

    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

    const appointment = await Appointment.findById(id);
    if (!appointment) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    if (status) appointment.status = status;
    if (meetLink) appointment.meetLink = meetLink;
    if (doctorResponse) appointment.doctorResponse = doctorResponse;

    await appointment.save();
    return NextResponse.json({ message: 'Updated', appointment });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating' }, { status: 500 });
  }
}

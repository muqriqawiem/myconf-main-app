import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Session from '@/model/Session';

export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the incoming request body
    const { title, description, date, startTime, endTime, conferenceTitle } = await req.json();

    // Validate the input (basic example)
    if (!title || !date || !startTime || !endTime || !conferenceTitle) {
      return NextResponse.json({ success: false, error: 'All required fields must be filled' }, { status: 400 });
    }

    // Create a new session
    const newSession = await Session.create({
      title,
      description,
      date,
      startTime,
      endTime,
      conferenceTitle,
    });

    // Return the created session
    return NextResponse.json({ success: true, session: newSession });
  } catch (error) {
    // Handle errors
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 });
  }
}

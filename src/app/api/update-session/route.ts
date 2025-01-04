import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Session from '@/model/Session';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const sessionId = params.id;
    const updates = await req.json();

    const updatedSession = await Session.findByIdAndUpdate(sessionId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 });
  }
}

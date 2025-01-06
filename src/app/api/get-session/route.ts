import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Session from '@/model/Session';


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const sessionId = params.id;
    const session = await Session.findById(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return NextResponse.json(
      { success: true, session },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0', // Disable caching
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Content-Type': 'application/json',
          },
        }
      );
    }
    return NextResponse.json(
      { success: false, error: 'An unknown error occurred' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
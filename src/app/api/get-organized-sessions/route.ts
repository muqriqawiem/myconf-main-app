import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Session from '@/model/Session';

// Explicitly opt out of static rendering
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const sessions = await Session.find({}); // Add filtering logic if needed
    return NextResponse.json(
      { success: true, sessions },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0', // Disable caching
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 });
  }
}
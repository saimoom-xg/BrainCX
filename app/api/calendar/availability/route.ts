import { NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/calendar';

export async function POST(request: Request) {
  try {
    const result = await checkAvailability(await request.json());
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, available_slots: [], message: 'Availability could not be checked.' }, { status: 502 });
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Here you would typically save to a database
    // For now, we'll just log it
    console.log('Volunteer Signup:', { name, email, phone, message });

    return NextResponse.json({ success: true, message: 'Volunteer signup successful' });
  } catch (error) {
    console.error('Error in volunteer signup:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

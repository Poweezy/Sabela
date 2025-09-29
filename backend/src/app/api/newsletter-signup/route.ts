import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Here you would typically save to a database
    // For now, we'll just log it
    console.log('Newsletter Signup:', { email });

    return NextResponse.json({ success: true, message: 'Newsletter signup successful' });
  } catch (error) {
    console.error('Error in newsletter signup:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

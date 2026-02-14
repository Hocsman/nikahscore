import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'API is working'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'NikahScore API is running',
    timestamp: new Date().toISOString()
  })
}

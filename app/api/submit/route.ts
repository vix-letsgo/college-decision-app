import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json({ error: 'No webhook URL configured' }, { status: 500 })
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data),
  })

  const text = await response.text()
  return NextResponse.json({ ok: true, response: text })
}

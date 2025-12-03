// app/api/proxy/ocr/route.ts
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Forward everything to your local FastAPI backend
  const response = await fetch('http://127.0.0.1:8000/ocr', {
    method: 'POST',
    body: request.body,
    headers: {
      'Content-Type': request.headers.get('Content-Type') || '',
    },
    // @ts-ignore – duplex is needed for streaming FormData
    duplex: 'half',
  });

  // Return exactly what FastAPI returns
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
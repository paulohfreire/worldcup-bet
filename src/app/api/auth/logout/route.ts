import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: 'Logout realizado com sucesso' });

  response.cookies.delete('token');

  return response;
}

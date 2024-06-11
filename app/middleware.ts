import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userSession = request.cookies.get('username');
  const ipAddress = request.headers.get('x-forwarded-for') || request.ip;

  if (!userSession) {
    return NextResponse.redirect(new URL('/register', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/poll/:path*', '/list-polls/:path*'],
};

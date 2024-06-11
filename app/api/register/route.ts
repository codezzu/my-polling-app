import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  const { username } = await request.json();
  const ipAddress = request.headers.get('x-forwarded-for') || request.ip;

  if (!username) {
    return NextResponse.json({ message: 'Kullanıcı adı zorunludur.' }, { status: 400 });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR ip_address = $2', [username, ipAddress]);
    if (existingUser.rowCount > 0) {
      return NextResponse.json({ message: 'Kullanıcı adı veya IP adresi zaten kayıtlı.' }, { status: 409 });
    }

    const result = await pool.query('INSERT INTO users (username, ip_address) VALUES ($1, $2)', [username, ipAddress]);
    return NextResponse.json({ message: 'Kullanıcı kaydedildi.' }, { status: 201 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

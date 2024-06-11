import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  const { optionId } = await request.json();
  const username = request.cookies.get('username');
  const ipAddress = request.headers.get('x-forwarded-for') || request.ip;

  if (!username) {
    return NextResponse.json({ message: 'Kullanıcı adı zorunludur.' }, { status: 400 });
  }

  try {
    // Check if the user has already voted in this poll
    const pollIdResult = await pool.query('SELECT poll_id FROM options WHERE id = $1', [optionId]);
    const pollId = pollIdResult.rows[0].poll_id;

    const voteCheckResult = await pool.query(
      'SELECT * FROM votes WHERE username = $1 AND option_id IN (SELECT id FROM options WHERE poll_id = $2)',
      [username, pollId]
    );

    if (voteCheckResult.rowCount > 0) {
      return NextResponse.json({ message: 'Bu anket için zaten oy kullandınız.' }, { status: 409 });
    }

    // Insert the vote
    const result = await pool.query(
      'INSERT INTO votes (option_id, ip_address, username) VALUES ($1, $2, $3)',
      [optionId, ipAddress, username]
    );

    return NextResponse.json({ message: 'Oy kullanıldı.' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

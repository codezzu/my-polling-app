import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID not provided.' }, { status: 400 });
  }

  try {
    const pollResult = await pool.query('SELECT * FROM polls WHERE id = $1', [id]);
    const optionsResult = await pool.query('SELECT * FROM options WHERE poll_id = $1', [id]);
    const votesResult = await pool.query('SELECT * FROM votes WHERE option_id IN (SELECT id FROM options WHERE poll_id = $1)', [id]);

    if (pollResult.rows.length === 0) {
      return NextResponse.json({ error: 'Anket bulunamadı.' }, { status: 404 });
    }

    const poll = pollResult.rows[0];
    const options = optionsResult.rows;
    const votes = votesResult.rows;

    return NextResponse.json({ poll, options, votes }, { status: 200 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

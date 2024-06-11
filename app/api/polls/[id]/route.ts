import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest, { params }) {
  const { id } = params;

  try {
    const pollResult = await pool.query('SELECT * FROM polls WHERE id = $1', [id]);
    const optionsResult = await pool.query('SELECT * FROM options WHERE poll_id = $1', [id]);
    const votesResult = await pool.query('SELECT * FROM votes WHERE option_id IN (SELECT id FROM options WHERE poll_id = $1)', [id]);

    if (pollResult.rowCount === 0) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const poll = pollResult.rows[0];
    const options = optionsResult.rows;
    const votes = votesResult.rows;

    return NextResponse.json({ poll, options, votes }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

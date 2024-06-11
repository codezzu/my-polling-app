import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  const { question, options } = await request.json();
  try {
    const result = await pool.query(
      'INSERT INTO polls (question) VALUES ($1) RETURNING id',
      [question]
    );
    const pollId = result.rows[0].id;

    const optionQueries = options.map((option: string) =>
      pool.query('INSERT INTO options (poll_id, text) VALUES ($1, $2)', [pollId, option])
    );
    await Promise.all(optionQueries);

    return NextResponse.json({ pollId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query('SELECT * FROM polls');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

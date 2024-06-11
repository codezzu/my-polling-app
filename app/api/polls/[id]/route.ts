import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Get the poll ID from the URL

  if (!id || id === 'polls') { // if the ID is not provided or it's the /polls endpoint
    try {
      const result = await pool.query('SELECT * FROM polls');
      return NextResponse.json(result.rows, { status: 200 });
    } catch (err) {
      const error = err as Error;
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  try {
    const pollResult = await pool.query('SELECT * FROM polls WHERE id = $1', [id]);
    const optionsResult = await pool.query('SELECT * FROM options WHERE poll_id = $1', [id]);
    const votesResult = await pool.query('SELECT * FROM votes WHERE option_id IN (SELECT id FROM options WHERE poll_id = $1)', [id]);

    if (pollResult.rows.length === 0) {
      return NextResponse.json({ error: 'Anket bulunamadı. Anket yok' }, { status: 404 });
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

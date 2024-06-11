import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

  console.log('Fetching poll with id:', id);  // Logging ekledik

  try {
    const pollResult = await pool.query('SELECT * FROM polls WHERE id = $1', [id]);
    const optionsResult = await pool.query('SELECT * FROM options WHERE poll_id = $1', [id]);
    const votesResult = await pool.query('SELECT * FROM votes WHERE option_id IN (SELECT id FROM options WHERE poll_id = $1)', [id]);

    if (pollResult.rows.length === 0) {
      console.error('Poll not found for id:', id);  // Logging ekledik
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const poll = pollResult.rows[0];
    const options = optionsResult.rows;
    const votes = votesResult.rows;

    console.log('Poll fetched successfully:', { poll, options, votes });  // Logging ekledik

    return NextResponse.json({ poll, options, votes }, { status: 200 });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching poll:', error.message);  // Logging ekledik
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


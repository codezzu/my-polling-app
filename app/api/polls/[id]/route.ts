import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;
  console.log(`Fetching poll with id: ${id}`); // Logging

  try {
    const pollResult = await pool.query('SELECT * FROM polls WHERE id = $1', [id]);
    if (pollResult.rowCount === 0) {
      console.error(`Poll not found for id: ${id}`); // Logging
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const optionsResult = await pool.query('SELECT * FROM options WHERE poll_id = $1', [id]);
    const votesResult = await pool.query('SELECT * FROM votes WHERE option_id IN (SELECT id FROM options WHERE poll_id = $1)', [id]);

    const poll = pollResult.rows[0];
    const options = optionsResult.rows;
    const votes = votesResult.rows;

    console.log(`Poll fetched successfully: ${JSON.stringify({ poll, options, votes })}`); // Logging

    return NextResponse.json({ poll, options, votes }, { status: 200 });
  } catch (err) {
    const error = err as Error;
    console.error(`Error fetching poll: ${error.message}`); // Logging
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

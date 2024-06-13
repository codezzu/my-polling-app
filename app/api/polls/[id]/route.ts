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
    const client = await pool.connect();
    try {
      const pollResult = await client.query('SELECT * FROM polls WHERE id = $1', [id]);
      const optionsResult = await client.query('SELECT * FROM options WHERE poll_id = $1', [id]);
      const votesResult = await client.query('SELECT * FROM votes WHERE option_id IN (SELECT id FROM options WHERE poll_id = $1)', [id]);

      if (pollResult.rowCount === 0) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
      }

      const poll = pollResult.rows[0];
      const options = optionsResult.rows;
      const votes = votesResult.rows;

      return NextResponse.json({ poll, options, votes }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (err) {
    const error = err as Error;
    console.error(`Error fetching poll: ${error.message}`); // Logging
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

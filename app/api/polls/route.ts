import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  const { question, options } = await request.json();
  console.log('Creating poll with question:', question, 'and options:', options);  // Logging ekledik

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

    console.log('Poll created successfully with id:', pollId);  // Logging ekledik

    return NextResponse.json({ pollId }, { status: 201 });
  } catch (err) {
    const error = err as Error;
    console.error('Error creating poll:', error.message);  // Logging ekledik
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log('Fetching all polls');  // Logging ekledik

  try {
    const result = await pool.query('SELECT * FROM polls');
    console.log('Polls fetched successfully:', result.rows);  // Logging ekledik
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching polls:', error.message);  // Logging ekledik
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

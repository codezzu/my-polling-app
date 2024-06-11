import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT v.username, v.ip_address, v.created_at, o.text AS option_text, p.question AS poll_question
      FROM votes v
      JOIN options o ON v.option_id = o.id
      JOIN polls p ON o.poll_id = p.id
      ORDER BY v.created_at DESC
    `);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

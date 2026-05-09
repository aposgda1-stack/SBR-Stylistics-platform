import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Whitelist of valid chapter IDs to prevent path traversal attacks
const VALID_ID_PATTERN = /^[a-z0-9-]+$/;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Chapter ID required' }, { status: 400 });
  }

  // Security: Validate ID format to prevent path traversal
  if (!VALID_ID_PATTERN.test(id)) {
    return NextResponse.json({ error: 'Invalid chapter ID' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', `${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    // Normalize: always use the URL id as chapterId to ensure consistent DB records
    data.chapterId = id;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }
}


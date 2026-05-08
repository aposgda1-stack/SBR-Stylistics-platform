import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Chapter ID required' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', `${id}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }
}

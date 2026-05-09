import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'chapters-meta.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Meta API error:", err);
    return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
  }
}

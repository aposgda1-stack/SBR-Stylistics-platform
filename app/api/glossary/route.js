import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const files = fs.readdirSync(dataDir).filter(f => f.startsWith('lecture-') && f.endsWith('.json'));
    
    let allTerms = [];
    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      if (data.theoretical) {
        allTerms = [...allTerms, ...data.theoretical.map(t => ({ 
          ...t, 
          chapter: data.title,
          chapterId: data.chapterId 
        }))];
      }
    }
    
    // Sort alphabetically
    allTerms.sort((a, b) => a.term.localeCompare(b.term));

    return NextResponse.json({ success: true, terms: allTerms });
  } catch (err) {
    console.error("Glossary API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import fs from 'fs';
import path from 'path';
import LectureClient from '../LectureClient';

export default async function LecturePage({ params }) {
  const { id } = params;
  const filePath = path.join(process.cwd(), 'data', `${id}.json`);
  
  if (!fs.existsSync(filePath)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-slate-500">Module Not Found</h1>
      </div>
    );
  }

  const chapterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return <LectureClient chapterData={chapterData} />;
}

export async function generateStaticParams() {
  const metaPath = path.join(process.cwd(), 'data', 'chapters-meta.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

  return meta.chapters.map((chapter) => ({
    id: chapter.id,
  }));
}

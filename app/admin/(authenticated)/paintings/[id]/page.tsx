import Link from 'next/link';
import { notFound } from 'next/navigation';
import PaintingForm from '@/components/admin/forms/PaintingForm';
import { readDataFile } from '@/lib/admin/data';
import type { PaintingsData } from '@/lib/admin/validation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaintingPage({ params }: PageProps) {
  const { id } = await params;
  const paintingId = parseInt(id, 10);

  const data = await readDataFile<PaintingsData>('paintings');
  const painting = data.paintings.find((p) => p.id === paintingId);

  if (!painting) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/paintings"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Paintings
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Painting</h1>
        <p className="text-gray-500 mt-1">{painting.title}</p>
      </div>

      <PaintingForm painting={painting} />
    </div>
  );
}

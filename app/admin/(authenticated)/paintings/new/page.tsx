import Link from 'next/link';
import PaintingForm from '@/components/admin/forms/PaintingForm';

export default function NewPaintingPage() {
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
        <h1 className="text-2xl font-semibold text-gray-900">New Painting</h1>
        <p className="text-gray-500 mt-1">Add a new painting to the gallery</p>
      </div>

      <PaintingForm isNew />
    </div>
  );
}

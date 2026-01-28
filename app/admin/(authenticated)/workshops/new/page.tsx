import Link from 'next/link';
import WorkshopForm from '@/components/admin/forms/WorkshopForm';

export default function NewWorkshopPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/workshops"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Workshops
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Workshop</h1>
        <p className="text-gray-500 mt-1">Create a new workshop offering</p>
      </div>

      <WorkshopForm isNew />
    </div>
  );
}

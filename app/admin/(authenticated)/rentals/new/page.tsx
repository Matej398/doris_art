import Link from 'next/link';
import RentalForm from '@/components/admin/forms/RentalForm';

export default function NewRentalPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/rentals"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Rentals
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Rental Item</h1>
        <p className="text-gray-500 mt-1">Add a new item available for rental</p>
      </div>

      <RentalForm isNew />
    </div>
  );
}

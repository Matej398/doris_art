import Link from 'next/link';
import { notFound } from 'next/navigation';
import RentalForm from '@/components/admin/forms/RentalForm';
import { readDataFile } from '@/lib/admin/data';
import type { RentalsData } from '@/lib/admin/validation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRentalPage({ params }: PageProps) {
  const { id } = await params;
  const rentalId = parseInt(id, 10);

  const data = await readDataFile<RentalsData>('rentals');
  const rental = data.rentals.find((r) => r.id === rentalId);

  if (!rental) {
    notFound();
  }

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
        <h1 className="text-2xl font-semibold text-gray-900">Edit Rental Item</h1>
        <p className="text-gray-500 mt-1">{rental.title}</p>
      </div>

      <RentalForm rental={rental} />
    </div>
  );
}

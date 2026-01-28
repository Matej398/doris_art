'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import Image from 'next/image';
import type { Rental, RentalsData } from '@/lib/admin/validation';

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchRentals = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/rentals');
      const data: RentalsData = await response.json();
      setRentals(data.rentals);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  async function handleDelete(id: number) {
    if (!confirm('Ali ste prepričani, da želite izbrisati ta artikel?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/rentals/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setRentals(rentals.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting rental:', error);
    } finally {
      setDeleting(null);
    }
  }

  const columns = [
    {
      key: 'image',
      label: 'Slika',
      render: (item: Rental) => (
        <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
          {item.image && (
            <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
          )}
        </div>
      ),
    },
    { key: 'title', label: 'Naslov' },
    { key: 'category', label: 'Kategorija' },
    {
      key: 'pricePerDay',
      label: 'Cena/dan',
      render: (item: Rental) => `${item.pricePerDay} ${item.currency}`,
    },
    {
      key: 'deposit',
      label: 'Varščina',
      render: (item: Rental) => `${item.deposit} ${item.currency}`,
    },
    {
      key: 'active',
      label: 'Status',
      render: (item: Rental) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {item.active ? 'Aktivno' : 'Neaktivno'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Izposoja</h1>
          <p className="text-gray-500 mt-1">Upravljanje artiklov za izposojo in cen</p>
        </div>
        <Link
          href="/admin/rentals/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="leading-none">Nov artikel</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="animate-pulse text-gray-500">Nalaganje artiklov...</div>
        </div>
      ) : (
        <DataTable
          data={rentals}
          columns={columns}
          editPath="/admin/rentals"
          onDelete={handleDelete}
          getId={(item) => item.id}
          isDeleting={deleting}
        />
      )}
    </div>
  );
}

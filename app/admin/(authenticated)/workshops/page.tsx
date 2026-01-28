'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import type { Workshop, WorkshopsData } from '@/lib/admin/validation';

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchWorkshops = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/workshops');
      const data: WorkshopsData = await response.json();
      setWorkshops(data.workshops);
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  async function handleDelete(id: number) {
    if (!confirm('Ali ste prepričani, da želite izbrisati to delavnico?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/workshops/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setWorkshops(workshops.filter((w) => w.id !== id));
      }
    } catch (error) {
      console.error('Error deleting workshop:', error);
    } finally {
      setDeleting(null);
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Naslov' },
    {
      key: 'audience',
      label: 'Ciljna skupina',
      render: (item: Workshop) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.audience === 'children' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
        }`}>
          {item.audience === 'children' ? 'Otroci' : 'Odrasli'}
        </span>
      ),
    },
    {
      key: 'active',
      label: 'Status',
      render: (item: Workshop) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {item.active ? 'Aktivno' : 'Neaktivno'}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Cena',
      render: (item: Workshop) => `${item.price} ${item.currency}`,
    },
    {
      key: 'schedules',
      label: 'Termini',
      render: (item: Workshop) => item.schedules.length,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Delavnice</h1>
          <p className="text-gray-500 mt-1">Upravljanje delavnic in terminov</p>
        </div>
        <Link
          href="/admin/workshops/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="leading-none">Nova delavnica</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="animate-pulse text-gray-500">Nalaganje delavnic...</div>
        </div>
      ) : (
        <DataTable
          data={workshops}
          columns={columns}
          editPath="/admin/workshops"
          onDelete={handleDelete}
          getId={(item) => item.id}
          isDeleting={deleting}
        />
      )}
    </div>
  );
}

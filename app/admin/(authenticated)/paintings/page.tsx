'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Painting, PaintingsData } from '@/lib/admin/validation';

export default function PaintingsPage() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchPaintings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/paintings');
      const data: PaintingsData = await response.json();
      setPaintings(data.paintings);
    } catch (error) {
      console.error('Error fetching paintings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaintings();
  }, [fetchPaintings]);

  async function handleDelete(id: number) {
    if (!confirm('Ali ste prepričani, da želite izbrisati to sliko?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/paintings/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPaintings(paintings.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting painting:', error);
    } finally {
      setDeleting(null);
    }
  }

  async function handleReorder(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= paintings.length) return;

    const reordered = [...paintings];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setPaintings(reordered);

    try {
      await fetch('/api/admin/paintings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paintings: reordered }),
      });
    } catch (error) {
      console.error('Error reordering paintings:', error);
      fetchPaintings();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Slike</h1>
          <p className="text-gray-500 mt-1">Upravljanje galerije umetnin</p>
        </div>
        <Link
          href="/admin/paintings/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="leading-none">Nova slika</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="animate-pulse text-gray-500">Nalaganje slik...</div>
        </div>
      ) : paintings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Ni najdenih slik. Dodajte svojo prvo sliko.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">Uporabite puščice za preurejanje slik.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paintings.map((painting, index) => (
            <div
              key={painting.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="relative h-48 bg-gray-100">
                {painting.images[0] ? (
                  <Image
                    src={painting.images[0].src}
                    alt={painting.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{painting.title}</h3>
                {painting.size && (
                  <p className="text-sm text-gray-500 mt-1">{painting.size}</p>
                )}
                {painting.technique && (
                  <p className="text-sm text-gray-500">{painting.technique}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {painting.images.length} {painting.images.length === 1 ? 'slika' : painting.images.length < 5 ? 'slike' : 'slik'}
                </p>
              </div>
              <div className="px-4 pb-4 space-y-2">
                <div className="flex gap-1 justify-center">
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index - 1)}
                    disabled={index === 0}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Premakni levo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-400 py-2">{index + 1} / {paintings.length}</span>
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index + 1)}
                    disabled={index === paintings.length - 1}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Premakni desno"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/paintings/${painting.id}`}
                    className="flex-1 text-center px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Uredi
                  </Link>
                  <button
                    onClick={() => handleDelete(painting.id)}
                    disabled={deleting === painting.id}
                    className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleting === painting.id ? '...' : 'Izbriši'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
}

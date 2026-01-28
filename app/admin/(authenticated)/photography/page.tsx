'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ImageUploader from '@/components/admin/ImageUploader';
import type { PhotographyData, GalleryImage } from '@/lib/admin/validation';

export default function PhotographyPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/photography');
      const data: PhotographyData = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Error fetching photography:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  async function handleAddImage(src: string) {
    if (!src) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/photography', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src, alt: 'Photography image' }),
      });

      if (response.ok) {
        const newImage = await response.json();
        setImages([...images, newImage]);
      }
    } catch (error) {
      console.error('Error adding image:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Ali ste prepričani, da želite izbrisati to sliko?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/photography/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setImages(images.filter((img) => img.id !== id));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setDeleting(null);
    }
  }

  async function handleUpdateAlt(id: number, alt: string) {
    try {
      await fetch(`/api/admin/photography/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt }),
      });
      setImages(images.map((img) => (img.id === id ? { ...img, alt } : img)));
    } catch (error) {
      console.error('Error updating image:', error);
    }
  }

  async function handleReorder(fromIndex: number, toIndex: number) {
    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setImages(reordered);

    try {
      await fetch('/api/admin/photography', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: reordered }),
      });
    } catch (error) {
      console.error('Error reordering images:', error);
      fetchImages();
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Galerija fotografij</h1>
        <p className="text-gray-500 mt-1">Upravljanje slik za stran fotografije</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dodaj novo sliko</h2>
        <ImageUploader
          onChange={handleAddImage}
          label="Naložite ali vnesite URL slike"
        />
        {saving && <p className="text-sm text-gray-500 mt-2">Dodajanje slike...</p>}
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="animate-pulse text-gray-500">Nalaganje fotografij...</div>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Ni slik v galeriji fotografij. Naložite svojo prvo sliko zgoraj.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Fotografije ({images.length})
            </h2>
            <p className="text-sm text-gray-500">Uporabite puščice za preurejanje slik</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative bg-gray-50 rounded-lg p-3"
              >
                <div className="relative h-32 rounded overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => handleUpdateAlt(img.id, e.target.value)}
                    placeholder="Opisno besedilo"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleReorder(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Premakni levo"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(index, index + 1)}
                      disabled={index === images.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Premakni desno"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    disabled={deleting === img.id}
                    className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                    title="Izbriši"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '../ImageUploader';
import Image from 'next/image';
import type { Painting, PaintingImage } from '@/lib/admin/validation';

interface PaintingFormProps {
  painting?: Painting;
  isNew?: boolean;
}

export default function PaintingForm({ painting, isNew = false }: PaintingFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: painting?.title || '',
    titleEn: painting?.titleEn || '',
    size: painting?.size || '',
    technique: painting?.technique || '',
    techniqueEn: painting?.techniqueEn || '',
    location: painting?.location || '',
    locationEn: painting?.locationEn || '',
    images: painting?.images || [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isNew ? '/api/admin/paintings' : `/api/admin/paintings/${painting?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save painting');
      }

      router.push('/admin/paintings');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save painting');
    } finally {
      setSaving(false);
    }
  }

  function addImage(src: string) {
    if (!src) return;
    const newImage: PaintingImage = {
      id: Date.now(),
      src,
      alt: form.title || 'Painting image',
    };
    setForm({ ...form, images: [...form.images, newImage] });
  }

  function removeImage(index: number) {
    const images = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images });
  }

  function updateImageAlt(index: number, alt: string) {
    const images = [...form.images];
    images[index] = { ...images[index], alt };
    setForm({ ...form, images });
  }

  function moveImage(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= form.images.length) return;

    const images = [...form.images];
    [images[index], images[newIndex]] = [images[newIndex], images[index]];
    setForm({ ...form, images });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Osnovne informacije</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naslov (SL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naslov (EN)</label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Velikost</label>
              <input
                type="text"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                placeholder="npr. 60x80 cm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tehnika (SL)</label>
              <input
                type="text"
                value={form.technique}
                onChange={(e) => setForm({ ...form, technique: e.target.value })}
                placeholder="npr. Olje na platnu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tehnika (EN)</label>
            <input
              type="text"
              value={form.techniqueEn}
              onChange={(e) => setForm({ ...form, techniqueEn: e.target.value })}
              placeholder="npr. Oil on canvas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokacija (SL)</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="npr. Zasebna zbirka, Ljubljana"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokacija (EN)</label>
            <input
              type="text"
              value={form.locationEn}
              onChange={(e) => setForm({ ...form, locationEn: e.target.value })}
              placeholder="npr. Private collection, Ljubljana"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Slike</h2>

        <ImageUploader
          onChange={(path) => addImage(path)}
          label="Dodaj sliko"
        />

        {form.images.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-500">
              {form.images.length} {form.images.length === 1 ? 'slika dodana' : form.images.length < 5 ? 'slike dodane' : 'slik dodanih'}. Prva slika je glavna slika.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {form.images.map((img, index) => (
                <div key={img.id} className="relative bg-gray-50 rounded-lg p-3">
                  <div className="relative h-40 rounded overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-accent text-white text-xs rounded">
                        Glavna
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => updateImageAlt(index, e.target.value)}
                      placeholder="Opisno besedilo"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === form.images.length - 1}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1 text-red-600 hover:text-red-800"
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

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors leading-none"
        >
          Prekliči
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 leading-none"
        >
          {saving ? 'Shranjevanje...' : isNew ? 'Ustvari sliko' : 'Shrani spremembe'}
        </button>
      </div>
    </form>
  );
}

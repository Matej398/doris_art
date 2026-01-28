'use client';

import { useState, useEffect, useCallback } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';

interface AboutData {
  biography: {
    sl: string[];
    en: string[];
  };
  image: string;
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/about');
      const aboutData = await response.json();
      setData(aboutData);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function saveData() {
    if (!data) return;

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('Podatki shranjeni!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Napaka pri shranjevanju');
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      setMessage('Napaka pri shranjevanju');
    } finally {
      setSaving(false);
    }
  }

  function updateParagraph(locale: 'sl' | 'en', index: number, value: string) {
    if (!data) return;

    const newBio = { ...data.biography };
    newBio[locale] = [...newBio[locale]];
    newBio[locale][index] = value;

    setData({ ...data, biography: newBio });
  }

  function addParagraph(locale: 'sl' | 'en') {
    if (!data) return;

    const newBio = { ...data.biography };
    newBio[locale] = [...newBio[locale], ''];

    setData({ ...data, biography: newBio });
  }

  function removeParagraph(locale: 'sl' | 'en', index: number) {
    if (!data) return;

    const newBio = { ...data.biography };
    newBio[locale] = newBio[locale].filter((_, i) => i !== index);

    setData({ ...data, biography: newBio });
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <div className="animate-pulse text-gray-500">Nalaganje podatkov...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">Napaka pri nalaganju podatkov</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">O meni</h1>
        <p className="text-gray-500 mt-1">Urejanje vsebine strani O meni</p>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.includes('Napaka') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Image */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profilna slika</h2>
        <ImageUploader
          value={data.image}
          onChange={(path) => setData({ ...data, image: path })}
          label="Slika avtorja"
        />
      </div>

      {/* Biography SL */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Biografija (SL)</h2>
          <button
            type="button"
            onClick={() => addParagraph('sl')}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj odstavek
          </button>
        </div>

        <div className="space-y-4">
          {data.biography.sl.map((paragraph, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={paragraph}
                onChange={(e) => updateParagraph('sl', index, e.target.value)}
                rows={3}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                placeholder={`Odstavek ${index + 1}`}
              />
              {data.biography.sl.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph('sl', index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg self-start"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Biography EN */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Biografija (EN)</h2>
          <button
            type="button"
            onClick={() => addParagraph('en')}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj odstavek
          </button>
        </div>

        <div className="space-y-4">
          {data.biography.en.map((paragraph, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={paragraph}
                onChange={(e) => updateParagraph('en', index, e.target.value)}
                rows={3}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                placeholder={`Paragraph ${index + 1}`}
              />
              {data.biography.en.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph('en', index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg self-start"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveData}
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Shranjevanje...' : 'Shrani spremembe'}
        </button>
      </div>
    </div>
  );
}

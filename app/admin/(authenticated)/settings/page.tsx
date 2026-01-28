'use client';

import { useState, useEffect, useCallback } from 'react';

interface SettingsData {
  rentalCategories: string[];
  pageVisibility: {
    workshops: boolean;
    paintings: boolean;
    rentals: boolean;
    gallery: boolean;
    photography: boolean;
    wallPaintings: boolean;
    about: boolean;
    other: boolean;
  };
}

const pageLabels: Record<string, string> = {
  wallPaintings: 'Stenske poslikave',
  workshops: 'Delavnice',
  paintings: 'Slike',
  rentals: 'Izposoja',
  photography: 'Fotografija',
  gallery: 'Galerija',
  about: 'O meni',
  other: 'Ostalo',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [message, setMessage] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  async function saveSettings() {
    if (!settings) return;

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('Nastavitve shranjene!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Napaka pri shranjevanju nastavitev');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Napaka pri shranjevanju nastavitev');
    } finally {
      setSaving(false);
    }
  }

  function addCategory() {
    if (!settings || !newCategory.trim()) return;

    if (settings.rentalCategories.includes(newCategory.trim())) {
      setMessage('Ta kategorija že obstaja');
      return;
    }

    setSettings({
      ...settings,
      rentalCategories: [...settings.rentalCategories, newCategory.trim()],
    });
    setNewCategory('');
  }

  function removeCategory(index: number) {
    if (!settings) return;

    const categories = settings.rentalCategories.filter((_, i) => i !== index);
    setSettings({ ...settings, rentalCategories: categories });
  }

  function togglePageVisibility(page: keyof SettingsData['pageVisibility']) {
    if (!settings) return;

    setSettings({
      ...settings,
      pageVisibility: {
        ...settings.pageVisibility,
        [page]: !settings.pageVisibility[page],
      },
    });
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <div className="animate-pulse text-gray-500">Nalaganje nastavitev...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">Napaka pri nalaganju nastavitev</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Nastavitve</h1>
        <p className="text-gray-500 mt-1">Upravljanje sistemskih nastavitev</p>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.includes('Napaka') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Rental Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategorije izposoje</h2>
        <p className="text-sm text-gray-500 mb-4">Upravljajte kategorije za artikle za izposojo.</p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Nova kategorija"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Dodaj
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {settings.rentalCategories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg"
            >
              {category}
              <button
                type="button"
                onClick={() => removeCategory(index)}
                className="text-gray-500 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Page Visibility */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vidnost podstrani</h2>
        <p className="text-sm text-gray-500 mb-4">Izberite, katere podstrani naj bodo vidne na spletni strani.</p>

        <div className="space-y-3">
          {(Object.keys(settings.pageVisibility) as Array<keyof typeof settings.pageVisibility>).map((page) => (
            <label key={page} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pageVisibility[page]}
                onChange={() => togglePageVisibility(page)}
                className="w-5 h-5 text-accent rounded focus:ring-accent"
              />
              <span className="text-gray-700">{pageLabels[page] || page}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                settings.pageVisibility[page]
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {settings.pageVisibility[page] ? 'Vidno' : 'Skrito'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Shranjevanje...' : 'Shrani nastavitve'}
        </button>
      </div>
    </div>
  );
}

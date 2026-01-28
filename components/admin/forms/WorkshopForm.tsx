'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '../ImageUploader';
import type { Workshop, Schedule } from '@/lib/admin/validation';

interface WorkshopFormProps {
  workshop?: Workshop;
  isNew?: boolean;
}

export default function WorkshopForm({ workshop, isNew = false }: WorkshopFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: workshop?.title || '',
    titleEn: workshop?.titleEn || '',
    audience: workshop?.audience || 'adults',
    active: workshop?.active ?? true,
    technique: workshop?.technique || '',
    techniqueEn: workshop?.techniqueEn || '',
    description: workshop?.description || '',
    descriptionEn: workshop?.descriptionEn || '',
    duration: workshop?.duration || '',
    durationEn: workshop?.durationEn || '',
    price: workshop?.price || 0,
    currency: workshop?.currency || 'EUR',
    includes: workshop?.includes || [],
    includesEn: workshop?.includesEn || [],
    ageRange: workshop?.ageRange || '',
    ageRangeEn: workshop?.ageRangeEn || '',
    maxParticipants: workshop?.maxParticipants || 8,
    image: workshop?.image || '',
    schedules: workshop?.schedules || [],
  });

  const [includesText, setIncludesText] = useState(form.includes.join(', '));
  const [includesEnText, setIncludesEnText] = useState(form.includesEn.join(', '));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const data = {
        ...form,
        includes: includesText.split(',').map((s) => s.trim()).filter(Boolean),
        includesEn: includesEnText.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const url = isNew ? '/api/admin/workshops' : `/api/admin/workshops/${workshop?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save workshop');
      }

      router.push('/admin/workshops');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workshop');
    } finally {
      setSaving(false);
    }
  }

  function addSchedule() {
    const newSchedule: Schedule = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      spotsTotal: form.maxParticipants,
      spotsTaken: 0,
    };
    setForm({ ...form, schedules: [...form.schedules, newSchedule] });
  }

  function updateSchedule(index: number, updates: Partial<Schedule>) {
    const schedules = [...form.schedules];
    schedules[index] = { ...schedules[index], ...updates };
    setForm({ ...form, schedules });
  }

  function removeSchedule(index: number) {
    const schedules = form.schedules.filter((_, i) => i !== index);
    setForm({ ...form, schedules });
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naslov (EN)
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciljna skupina</label>
              <select
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value as 'children' | 'adults' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              >
                <option value="adults">Odrasli</option>
                <option value="children">Otroci</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 text-accent rounded"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Aktivno (vidno na spletni strani)
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tehnika (SL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.technique}
                onChange={(e) => setForm({ ...form, technique: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tehnika (EN)</label>
              <input
                type="text"
                value={form.techniqueEn}
                onChange={(e) => setForm({ ...form, techniqueEn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trajanje (SL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="npr. 2 uri"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trajanje (EN)</label>
              <input
                type="text"
                value={form.durationEn}
                onChange={(e) => setForm({ ...form, durationEn: e.target.value })}
                placeholder="npr. 2 hours"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Opis</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opis (SL) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opis (EN)</label>
            <textarea
              value={form.descriptionEn}
              onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Participants */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cena in udeleženci</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cena (EUR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maks. udeležencev <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.maxParticipants}
              onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starostni razpon (SL)</label>
            <input
              type="text"
              value={form.ageRange}
              onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
              placeholder="npr. 6-12 let"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vključeno (SL) <span className="text-gray-500 font-normal">- ločeno z vejico</span>
            </label>
            <input
              type="text"
              value={includesText}
              onChange={(e) => setIncludesText(e.target.value)}
              placeholder="material, platno, prigrizki"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vključeno (EN) <span className="text-gray-500 font-normal">- ločeno z vejico</span>
            </label>
            <input
              type="text"
              value={includesEnText}
              onChange={(e) => setIncludesEnText(e.target.value)}
              placeholder="materials, canvas, snacks"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Slika</h2>
        <ImageUploader
          value={form.image}
          onChange={(path) => setForm({ ...form, image: path })}
          label="Slika delavnice"
        />
      </div>

      {/* Schedule - Single Date */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Naslednji termin</h2>
            <p className="text-sm text-gray-500">Opcijsko: nastavite datum naslednje delavnice</p>
          </div>
          {form.schedules.length === 0 && (
            <button
              type="button"
              onClick={addSchedule}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="leading-none">Dodaj termin</span>
            </button>
          )}
        </div>

        {form.schedules.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Ni nastavljenega termina. Delavnica bo prikazana brez datuma.</p>
        ) : (
          <div className="space-y-4">
            {form.schedules.slice(0, 1).map((schedule, index) => (
              <div key={schedule.id} className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                  <input
                    type="date"
                    value={schedule.date}
                    onChange={(e) => updateSchedule(index, { date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Čas</label>
                  <input
                    type="time"
                    value={schedule.time}
                    onChange={(e) => updateSchedule(index, { time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mest</label>
                  <input
                    type="number"
                    value={schedule.spotsTotal}
                    onChange={(e) => updateSchedule(index, { spotsTotal: Number(e.target.value) })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zasedeno</label>
                  <input
                    type="number"
                    value={schedule.spotsTaken}
                    onChange={(e) => updateSchedule(index, { spotsTaken: Number(e.target.value) })}
                    min="0"
                    max={schedule.spotsTotal}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Odstrani termin"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
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
          {saving ? 'Shranjevanje...' : isNew ? 'Ustvari delavnico' : 'Shrani spremembe'}
        </button>
      </div>
    </form>
  );
}

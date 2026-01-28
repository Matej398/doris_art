import Link from 'next/link';
import { readDataFile } from '@/lib/admin/data';
import type { WorkshopsData, PaintingsData, RentalsData, GalleryData, PhotographyData } from '@/lib/admin/validation';

async function getStats() {
  const [workshops, paintings, rentals, gallery, photography] = await Promise.all([
    readDataFile<WorkshopsData>('workshops'),
    readDataFile<PaintingsData>('paintings'),
    readDataFile<RentalsData>('rentals'),
    readDataFile<GalleryData>('gallery'),
    readDataFile<PhotographyData>('photography'),
  ]);

  return {
    workshops: {
      total: workshops.workshops.length,
      active: workshops.workshops.filter((w) => w.active).length,
    },
    paintings: {
      total: paintings.paintings.length,
    },
    rentals: {
      total: rentals.rentals.length,
      active: rentals.rentals.filter((r) => r.active).length,
    },
    gallery: {
      total: gallery.images.length,
    },
    photography: {
      total: photography.images.length,
    },
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: 'Delavnice',
      href: '/admin/workshops',
      count: stats.workshops.total,
      subtitle: `${stats.workshops.active} aktivnih`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Slike',
      href: '/admin/paintings',
      count: stats.paintings.total,
      subtitle: 'Skupaj umetnin',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Izposoja',
      href: '/admin/rentals',
      count: stats.rentals.total,
      subtitle: `${stats.rentals.active} aktivnih`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Stenske poslikave',
      href: '/admin/gallery',
      count: stats.gallery.total,
      subtitle: 'Slik stenskih poslikav',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      title: 'Fotografija',
      href: '/admin/photography',
      count: stats.photography.total,
      subtitle: 'Fotografij',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Nadzorna plošča</h1>
        <p className="text-gray-500 mt-1">Dobrodošli v skrbniški plošči</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{card.count}</p>
                <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
              </div>
              <div className="text-accent">{card.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hitre akcije</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/workshops/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="leading-none">Nova delavnica</span>
          </Link>
          <Link
            href="/admin/paintings/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="leading-none">Nova slika</span>
          </Link>
          <Link
            href="/admin/rentals/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="leading-none">Nov artikel za izposojo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

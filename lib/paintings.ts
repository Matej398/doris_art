// TypeScript interfaces for paintings data
// Structured to mirror MySQL schema for easy database migration

export interface PaintingImage {
  id: number;
  src: string;
  alt: string;
}

export interface Painting {
  id: number;
  title: string;
  titleEn?: string;
  size: string;
  technique: string;
  techniqueEn?: string;
  location?: string;
  locationEn?: string;
  images: PaintingImage[];
}

export interface PaintingsData {
  paintings: Painting[];
}

// Function to load paintings data from JSON file
// When migrating to MySQL, replace this function's implementation with a database query
export async function getPaintings(): Promise<Painting[]> {
  // In a client component, we'll import the JSON directly
  // For server components or API routes, you could use fs.readFile
  const data: PaintingsData = await import('@/data/paintings.json');
  return data.paintings;
}

// Get a single painting by ID
export async function getPaintingById(id: number): Promise<Painting | undefined> {
  const paintings = await getPaintings();
  return paintings.find(p => p.id === id);
}


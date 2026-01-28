import { z } from 'zod';

// Workshop schemas
export const scheduleSchema = z.object({
  id: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  spotsTotal: z.number().min(1),
  spotsTaken: z.number().min(0),
});

export const workshopSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  titleEn: z.string().optional().default(''),
  audience: z.enum(['children', 'adults']),
  active: z.boolean(),
  technique: z.string().min(1, 'Technique is required'),
  techniqueEn: z.string().optional().default(''),
  description: z.string().min(1, 'Description is required'),
  descriptionEn: z.string().optional().default(''),
  duration: z.string().min(1, 'Duration is required'),
  durationEn: z.string().optional().default(''),
  price: z.number().min(0),
  currency: z.string().default('EUR'),
  includes: z.array(z.string()),
  includesEn: z.array(z.string()).optional().default([]),
  ageRange: z.string().optional().default(''),
  ageRangeEn: z.string().optional().default(''),
  maxParticipants: z.number().min(1),
  image: z.string().min(1, 'Image is required'),
  schedules: z.array(scheduleSchema),
});

export const workshopCreateSchema = workshopSchema.omit({ id: true });
export const workshopUpdateSchema = workshopSchema.partial().required({ id: true });

// Painting schemas
export const paintingImageSchema = z.object({
  id: z.number(),
  src: z.string().min(1),
  alt: z.string().optional().default(''),
});

export const paintingSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  titleEn: z.string().optional().default(''),
  size: z.string().optional().default(''),
  technique: z.string().optional().default(''),
  techniqueEn: z.string().optional().default(''),
  location: z.string().optional().default(''),
  locationEn: z.string().optional().default(''),
  images: z.array(paintingImageSchema),
});

export const paintingCreateSchema = paintingSchema.omit({ id: true });
export const paintingUpdateSchema = paintingSchema.partial().required({ id: true });

// Rental schemas
export const rentalSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  titleEn: z.string().optional().default(''),
  description: z.string().min(1, 'Description is required'),
  descriptionEn: z.string().optional().default(''),
  image: z.string().min(1, 'Image is required'),
  pricePerDay: z.number().min(0),
  deposit: z.number().min(0),
  currency: z.string().default('EUR'),
  category: z.string().min(1, 'Category is required'),
  dimensions: z.string().optional().default(''),
  active: z.boolean(),
});

export const rentalCreateSchema = rentalSchema.omit({ id: true });
export const rentalUpdateSchema = rentalSchema.partial().required({ id: true });

// Gallery/Photography image schemas
export const galleryImageSchema = z.object({
  id: z.number(),
  src: z.string().min(1, 'Image source is required'),
  alt: z.string().optional().default(''),
});

export const galleryImageCreateSchema = galleryImageSchema.omit({ id: true });

// Type exports
export type Workshop = z.infer<typeof workshopSchema>;
export type WorkshopCreate = z.infer<typeof workshopCreateSchema>;
export type Schedule = z.infer<typeof scheduleSchema>;
export type Painting = z.infer<typeof paintingSchema>;
export type PaintingCreate = z.infer<typeof paintingCreateSchema>;
export type PaintingImage = z.infer<typeof paintingImageSchema>;
export type Rental = z.infer<typeof rentalSchema>;
export type RentalCreate = z.infer<typeof rentalCreateSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;

// Data file types
export interface WorkshopsData {
  workshops: Workshop[];
  eventTypes: Array<{ id: string; sl: string; en: string }>;
}

export interface PaintingsData {
  paintings: Painting[];
}

export interface RentalsData {
  rentals: Rental[];
}

export interface GalleryData {
  images: GalleryImage[];
}

export interface PhotographyData {
  images: GalleryImage[];
}

// TypeScript interfaces for workshops data
// Structured to mirror MySQL schema for easy database migration

export type Audience = "children" | "adults";

export interface WorkshopSchedule {
  id: number;
  date: string; // ISO date format: "2026-01-25"
  time: string; // "10:00"
  spotsTotal: number;
  spotsTaken: number;
}

export interface Workshop {
  id: number;
  title: string;
  titleEn?: string;
  audience: Audience;
  technique: string;
  techniqueEn?: string;
  description: string;
  descriptionEn?: string;
  duration: string;
  durationEn?: string;
  price: number;
  currency: string;
  includes: string[];
  includesEn?: string[];
  ageRange?: string;
  ageRangeEn?: string;
  maxParticipants: number;
  image: string;
  schedules: WorkshopSchedule[];
}

export interface EventType {
  id: string;
  sl: string;
  en: string;
}

export interface WorkshopsData {
  workshops: Workshop[];
  eventTypes: EventType[];
}

// Helper function to get available spots for a schedule
export function getAvailableSpots(schedule: WorkshopSchedule): number {
  return schedule.spotsTotal - schedule.spotsTaken;
}

// Helper function to check if a schedule is full
export function isScheduleFull(schedule: WorkshopSchedule): boolean {
  return getAvailableSpots(schedule) <= 0;
}

// Helper function to get the next available schedule for a workshop
export function getNextSchedule(workshop: Workshop): WorkshopSchedule | null {
  const now = new Date();
  const upcomingSchedules = workshop.schedules
    .filter(s => new Date(s.date) >= now && !isScheduleFull(s))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return upcomingSchedules[0] || null;
}

// Helper function to format date in Slovenian
export function formatDateSl(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}.${month}.`;
}

// Helper function to format date in English
export function formatDateEn(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Function to load workshops data
export async function getWorkshops(): Promise<Workshop[]> {
  const data: WorkshopsData = await import('@/data/workshops.json');
  return data.workshops;
}

// Function to load event types
export async function getEventTypes(): Promise<EventType[]> {
  const data: WorkshopsData = await import('@/data/workshops.json');
  return data.eventTypes;
}

// Filter workshops by audience
export function filterByAudience(workshops: Workshop[], audience: Audience): Workshop[] {
  return workshops.filter(w => w.audience === audience);
}


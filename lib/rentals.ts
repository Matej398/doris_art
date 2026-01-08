// TypeScript interfaces for rentals data

export interface RentalItem {
  id: number;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  pricePerDay: number;
  deposit: number; // varščina - per item
  currency: string;
  category?: string;
  dimensions?: string;
  active?: boolean;
}

export interface RentalReservation {
  rentalId: number;
  rentalTitle: string;
  name: string;
  email: string;
  phone: string;
  pickupDate: string;
  returnDate: string;
  pickupTime?: string;
  message?: string;
  totalPrice: number;
  deposit: number;
  currency: string;
}

export interface RentalsData {
  rentals: RentalItem[];
}

// Helper function to filter active rentals
export function getActiveRentals(rentals: RentalItem[]): RentalItem[] {
  return rentals.filter(r => r.active !== false);
}

// Helper function to get rental by ID
export function getRentalById(rentals: RentalItem[], id: number): RentalItem | undefined {
  return rentals.find(r => r.id === id);
}

// Helper function to calculate rental days
export function calculateRentalDays(pickupDate: string, returnDate: string): number {
  const pickup = new Date(pickupDate);
  const return_ = new Date(returnDate);
  const diffTime = return_.getTime() - pickup.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1; // Minimum 1 day
}

// Helper function to calculate total price
export function calculateTotalPrice(
  pricePerDay: number,
  days: number,
  deposit: number
): { rentalPrice: number; deposit: number; total: number } {
  const rentalPrice = pricePerDay * days;
  const total = rentalPrice + deposit;
  return { rentalPrice, deposit, total };
}

// Function to load rentals data
export async function getRentals(): Promise<RentalItem[]> {
  const data: RentalsData = await import('@/data/rentals.json');
  return data.rentals;
}



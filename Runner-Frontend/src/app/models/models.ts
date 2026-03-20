export interface Shoe {
  id: string;
  brand: string;
  model: string;
  purchaseDate: string;
  totalMiles: number;
  color?: string;
  notes?: string;
}

export interface Run {
  id: string;
  date: string;
  distance: number; // in miles
  duration: number; // in minutes
  shoeId: string;
  pace: number; // calculated: minutes per mile
  notes?: string;
  route?: string;
}

export interface Shoe {
  id: number;
  brand: string;
  model: string;
  purchaseDate: string;
  totalMiles: number;
  color?: string;
  notes?: string;
}

export interface Run {
  id: number;
  date: string;
  distance: number; // in miles
  duration: number; // in minutes
  shoeId: number;
  pace: number; // calculated: minutes per mile
  notes?: string;
  route?: string;
}

import { Injectable, signal, computed } from '@angular/core';
import { Run, Shoe } from '../models/models';

const MOCK_SHOES: Shoe[] = [
  {
    id: '1',
    brand: 'Nike',
    model: 'Air Zoom Pegasus 40',
    purchaseDate: '2024-01-15',
    totalMiles: 127.5,
    color: 'Blue/White',
    notes: 'Great for daily training'
  },
  {
    id: '2',
    brand: 'Brooks',
    model: 'Ghost 15',
    purchaseDate: '2024-03-20',
    totalMiles: 45.2,
    color: 'Black/Orange',
    notes: 'Comfortable cushioning'
  }
];

const MOCK_RUNS: Run[] = [
  {
    id: '1',
    date: '2026-03-19',
    distance: 5.2,
    duration: 42,
    shoeId: '1',
    pace: 8.08,
    route: 'Central Park Loop',
    notes: 'Felt great!'
  },
  {
    id: '2',
    date: '2026-03-17',
    distance: 3.1,
    duration: 27,
    shoeId: '2',
    pace: 8.71,
    route: 'Morning neighborhood run'
  },
  {
    id: '3',
    date: '2026-03-15',
    distance: 8.0,
    duration: 68,
    shoeId: '1',
    pace: 8.5,
    route: 'River trail',
    notes: 'Long run day'
  },
  {
    id: '4',
    date: '2026-03-13',
    distance: 4.5,
    duration: 36,
    shoeId: '2',
    pace: 8.0,
    route: 'Hill repeats'
  }
];

@Injectable({ providedIn: 'root' })
export class RunningService {
  private _runs = signal<Run[]>(MOCK_RUNS);
  private _shoes = signal<Shoe[]>(MOCK_SHOES);

  readonly runs = this._runs.asReadonly();
  readonly shoes = this._shoes.asReadonly();

  readonly totalDistance = computed(() =>
    this._runs().reduce((sum, run) => sum + run.distance, 0)
  );

  readonly averagePace = computed(() => {
    const runs = this._runs();
    if (!runs.length) return 0;
    return runs.reduce((sum, r) => sum + r.pace, 0) / runs.length;
  });

  addRun(run: Omit<Run, 'id' | 'pace'>): void {
    const pace = run.duration / run.distance;
    const newRun: Run = { ...run, id: Date.now().toString(), pace };
    this._runs.update(runs => [newRun, ...runs]);
    this._shoes.update(shoes =>
      shoes.map(shoe =>
        shoe.id === run.shoeId
          ? { ...shoe, totalMiles: shoe.totalMiles + run.distance }
          : shoe
      )
    );
  }

  deleteRun(id: string): void {
    const run = this._runs().find(r => r.id === id);
    if (run) {
      this._shoes.update(shoes =>
        shoes.map(shoe =>
          shoe.id === run.shoeId
            ? { ...shoe, totalMiles: Math.max(0, shoe.totalMiles - run.distance) }
            : shoe
        )
      );
    }
    this._runs.update(runs => runs.filter(r => r.id !== id));
  }

  addShoe(shoe: Omit<Shoe, 'id' | 'totalMiles'>): void {
    const newShoe: Shoe = { ...shoe, id: Date.now().toString(), totalMiles: 0 };
    this._shoes.update(shoes => [...shoes, newShoe]);
  }

  updateShoe(id: string, updates: Partial<Shoe>): void {
    this._shoes.update(shoes =>
      shoes.map(shoe => (shoe.id === id ? { ...shoe, ...updates } : shoe))
    );
  }

  deleteShoe(id: string): void {
    this._shoes.update(shoes => shoes.filter(s => s.id !== id));
  }

  getRunsForShoe(shoeId: string): Run[] {
    return this._runs().filter(r => r.shoeId === shoeId);
  }

  findShoe(shoeId: string): Shoe | undefined {
    return this._shoes().find(s => s.id === shoeId);
  }
}

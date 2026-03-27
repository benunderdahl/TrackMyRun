import { Injectable, signal, computed, inject } from '@angular/core';
import { Run, Shoe } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

const API = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class RunningService {
  private http = inject(HttpClient);
  private _runs = signal<Run[]>([]);
  private _shoes = signal<Shoe[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
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

  // bootstrap
  loadAll(): void {
    this.loadShoes();
    this.loadRuns();
  }

  // Runs
  loadRuns(): void {
      this.loading.set(true);
      this.http.get<Run[]>(`${API}/runs`, {withCredentials: true}).subscribe({
        next: (runs) => {
          this._runs.set(runs);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set('Failed to load runs: ' + e.message);
          this.loading.set(false);
        }
      });
    }
  

  addRun(run: Omit<Run, 'id' | 'pace'>): void {
    this.http.post<Run>(`${API}/runs`, run, {withCredentials: true}).pipe(
      tap(() => this.loadShoes())
    ).subscribe({
      next: (created) => this._runs.update(r => [created, ...r]), // id comes from backend
      error: (e) => this.error.set('Failed to add run: ' + e.message)
    });
  }

  deleteRun(id: number): void {
  this.http.delete(`${API}/runs/${id}`, {withCredentials: true}).pipe(
    tap(() => this.loadShoes()) // reload shoes so mileage reflects the deletion
  ).subscribe({
    next: () => this._runs.update(r => r.filter(run => run.id !== id)),
    error: (e) => this.error.set('Failed to delete run: ' + e.message)
  });
}

  updateRun(id: number, updates: Partial<Run>): void {
      this.http.put<Run>(`${API}/runs/${id}`, updates, {withCredentials: true}).pipe(
        tap(() => this.loadShoes()) // reload shoes so mileage updates
      ).subscribe({
        next: (updated) => this._runs.update(r =>
          r.map(run => run.id === id ? updated : run)
        ),
        error: (e) => this.error.set('Failed to update run: ' + e.message)
      });
  }

  // Shoes

    loadShoes(): void {
    this.loading.set(true);
    this.http.get<Shoe[]>(`${API}/shoes`, {withCredentials: true}).subscribe({
      next: (shoes) => {
        this._shoes.set(shoes);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Failed to load shoes: ' + e.message);
        this.loading.set(false);
      }
    });
  }

addShoe(shoe: Omit<Shoe, 'id' | 'totalMiles'>): void {
  this.http.post<Shoe>(`${API}/shoes`, shoe, {withCredentials: true}).subscribe({
    next: (created) => this._shoes.update(s => [...s, created]), // id comes from backend
    error: (e) => this.error.set('Failed to add shoe: ' + e.message)
  });
}

  updateShoe(id: number, updates: Partial<Shoe>): void {
    this.http.put<Shoe>(`${API}/shoes/${id}`, updates, {withCredentials: true}).subscribe({
      next: (updated) => this._shoes.update(s => 
        s.map(shoe => shoe.id === id ? updated : shoe)
      ),
      error: (e) => this.error.set('Failed to update shoe: ' + e.message )
    });
  }

  deleteShoe(id: number): void {
  this.http.delete(`${API}/shoes/${id}`, {withCredentials: true}).subscribe({
    next: () => this._shoes.update(s => s.filter(sh => sh.id !== id)),
    error: (e) => this.error.set('Failed to delete shoe: ' + e.message)
  });
}

  // Helper methods
  getRunsForShoe(shoeId: number): Run[] {
    return this._runs().filter(r => r.shoeId === shoeId);
  }

  findShoe(shoeId: number): Shoe | undefined {
    return this._shoes().find(s => s.id === shoeId);
  }
}

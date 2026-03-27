import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RunningService } from '../../services/running.service';
import { DatePipe } from '@angular/common';

interface RunForm {
  date: string;
  distance: string;
  duration: string;
  shoeId: string;
  route: string;
  notes: string;
}

@Component({
  selector: 'app-run-log',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl text-gray-900">Run Log</h1>
        <button (click)="toggleForm()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          @if (showForm()) {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Cancel
          } @else {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Log Run
          }
        </button>
      </div>

      <!-- Add Run Form -->
      @if (showForm()) {
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl text-gray-900 mb-4">Log New Run</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1">Date</label>
                <input type="date" [(ngModel)]="form.date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Shoes</label>
                <select [(ngModel)]="form.shoeId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select shoes</option>
                  @for (shoe of svc.shoes(); track shoe.id) {
                    <option [value]="shoe.id">{{ shoe.brand }} {{ shoe.model }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Distance (miles)</label>
                <input type="number" step="0.1" [(ngModel)]="form.distance" placeholder="5.0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Duration (minutes)</label>
                <input type="number" step="1" [(ngModel)]="form.duration" placeholder="45"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Route (optional)</label>
              <input type="text" [(ngModel)]="form.route" placeholder="Central Park Loop"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Notes (optional)</label>
              <textarea [(ngModel)]="form.notes" placeholder="How did it feel?" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <button (click)="submitRun()"
              class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Save Run
            </button>
          </div>
        </div>
      }

      <!-- Runs List -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl text-gray-900">All Runs ({{ svc.runs().length }})</h2>
        </div>
        <div class="divide-y divide-gray-200">
          @if (svc.runs().length > 0) {
            @for (run of svc.runs(); track run.id) {
              <div class="p-6 hover:bg-gray-50">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <p class="text-xl text-gray-900">{{ run.distance }} miles</p>
                      <span class="text-gray-300">|</span>
                      <p class="text-gray-600">{{ formatDuration(run.duration) }}</p>
                      <span class="text-gray-300">|</span>
                      <p class="text-gray-600">{{ formatPace(run.pace) }} pace</p>
                    </div>
                    @if (run.route) {
                      <p class="text-gray-700 mb-1">{{ run.route }}</p>
                    }
                    @if (svc.findShoe(run.shoeId); as shoe) {
                      <p class="text-gray-500 text-sm">Shoes: {{ shoe.brand }} {{ shoe.model }}</p>
                    }
                    @if (run.notes) {
                      <p class="text-gray-600 text-sm mt-2 italic">{{ run.notes }}</p>
                    }
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="text-right">
                      <p class="text-gray-900">{{ run.date | date:'mediumDate' }}</p>
                    </div>
                    <button (click)="svc.deleteRun(run.id)"
                      class="text-red-500 hover:text-red-700 p-1" title="Delete run">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            }
          } @else {
            <div class="p-12 text-center text-gray-500">
              <p class="mb-4">No runs logged yet</p>
              <button (click)="showForm.set(true)" class="text-blue-600 hover:text-blue-700">
                Log your first run
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class RunLogComponent {
  svc = inject(RunningService);
  showForm = signal(false);

  form: RunForm = this.defaultForm();

  defaultForm(): RunForm {
    return {
      date: new Date().toISOString().split('T')[0],
      distance: '',
      duration: '',
      shoeId: '',
      route: '',
      notes: ''
    };
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.form = this.defaultForm();
  }

  submitRun(): void {
    if (!this.form.distance || !this.form.duration || !this.form.shoeId) return;
    this.svc.addRun({
      date: this.form.date,
      distance: parseFloat(this.form.distance),
      duration: parseFloat(this.form.duration),
      shoeId: Number(this.form.shoeId),
      route: this.form.route,
      notes: this.form.notes
    });
    this.form = this.defaultForm();
    this.showForm.set(false);
  }

  formatPace(pace: number): string {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDuration(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }
}

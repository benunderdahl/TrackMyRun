import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RunningService } from '../../services/running.service';
import { Shoe } from '../../models/models';

interface ShoeForm {
  brand: string;
  model: string;
  purchaseDate: string;
  color: string;
  notes: string;
}

@Component({
  selector: 'app-shoes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl text-gray-900">Running Shoes</h1>
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
            Add Shoes
          }
        </button>
      </div>

      <!-- Add/Edit Shoe Form -->
      @if (showForm()) {
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl text-gray-900 mb-4">{{ editingId() ? 'Edit Shoes' : 'Add New Shoes' }}</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1">Brand *</label>
                <input type="text" [(ngModel)]="form.brand" placeholder="Nike, Brooks, Adidas..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Model *</label>
                <input type="text" [(ngModel)]="form.model" placeholder="Pegasus 40, Ghost 15..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Purchase Date</label>
                <input type="date" [(ngModel)]="form.purchaseDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Color</label>
                <input type="text" [(ngModel)]="form.color" placeholder="Blue/White"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Notes</label>
              <textarea [(ngModel)]="form.notes" placeholder="Any observations about these shoes..." rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div class="flex gap-2">
              <button (click)="submitShoe()"
                class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ editingId() ? 'Update Shoes' : 'Add Shoes' }}
              </button>
              <button type="button" (click)="cancelEdit()"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Shoes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @if (svc.shoes().length > 0) {
          @for (shoe of svc.shoes(); track shoe.id) {
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-xl text-gray-900">{{ shoe.brand }}</h3>
                    <p class="text-gray-600">{{ shoe.model }}</p>
                    @if (shoe.color) {
                      <p class="text-gray-500 text-sm mt-1">{{ shoe.color }}</p>
                    }
                  </div>
                  <div class="flex gap-1">
                    <button (click)="handleEdit(shoe)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit shoe">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button (click)="handleDelete(shoe)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete shoe">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-600 text-sm">Total Miles</span>
                    <span class="text-gray-900">{{ shoe.totalMiles.toFixed(1) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-600 text-sm">Runs</span>
                    <span class="text-gray-900">{{ getRunCount(shoe.id) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-600 text-sm">Days Owned</span>
                    <span class="text-gray-900">{{ getDaysOwned(shoe.purchaseDate) }}</span>
                  </div>

                  <div [class]="getStatus(shoe.totalMiles).bg + ' mt-4 px-3 py-2 rounded-lg'">
                    <p [class]="getStatus(shoe.totalMiles).color + ' text-sm text-center'">
                      {{ getStatus(shoe.totalMiles).text }}
                    </p>
                  </div>

                  @if (shoe.notes) {
                    <div class="mt-4 pt-4 border-t border-gray-200">
                      <p class="text-gray-600 text-sm italic">{{ shoe.notes }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        } @else {
          <div class="col-span-full bg-white rounded-lg shadow p-12 text-center">
            <p class="text-gray-500 mb-4">No shoes added yet</p>
            <button (click)="showForm.set(true)" class="text-blue-600 hover:text-blue-700">
              Add your first pair
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class ShoesComponent {
  svc = inject(RunningService);
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form: ShoeForm = this.defaultForm();

  defaultForm(): ShoeForm {
    return {
      brand: '',
      model: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      color: '',
      notes: ''
    };
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.cancelEdit();
  }

  handleEdit(shoe: Shoe): void {
    this.form = {
      brand: shoe.brand,
      model: shoe.model,
      purchaseDate: shoe.purchaseDate,
      color: shoe.color || '',
      notes: shoe.notes || ''
    };
    this.editingId.set(shoe.id);
    this.showForm.set(true);
  }

  handleDelete(shoe: Shoe): void {
    const runCount = this.getRunCount(shoe.id);
    if (runCount > 0) {
      if (confirm(`This shoe has ${runCount} runs logged. Delete anyway?`)) {
        this.svc.deleteShoe(shoe.id);
      }
    } else {
      this.svc.deleteShoe(shoe.id);
    }
  }

  submitShoe(): void {
    if (!this.form.brand || !this.form.model) return;
    const id = this.editingId();
    if (id) {
      this.svc.updateShoe(id, this.form);
    } else {
      this.svc.addShoe(this.form);
    }
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form = this.defaultForm();
  }

  getRunCount(shoeId: string): number {
    return this.svc.getRunsForShoe(shoeId).length;
  }

  getDaysOwned(purchaseDate: string): number {
    return Math.floor(
      (Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  getStatus(miles: number): { text: string; color: string; bg: string } {
    if (miles >= 400) return { text: 'Replace soon', color: 'text-red-600', bg: 'bg-red-50' };
    if (miles >= 300) return { text: 'High mileage', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (miles >= 200) return { text: 'Moderate use', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'Good condition', color: 'text-green-600', bg: 'bg-green-50' };
  }
}

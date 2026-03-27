import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RunningService } from '../../services/running.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="space-y-8">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Total Distance</p>
              <p class="text-3xl text-gray-900 mt-1">{{ svc.totalDistance().toFixed(1) }}</p>
              <p class="text-gray-600 text-sm mt-1">miles</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Total Runs</p>
              <p class="text-3xl text-gray-900 mt-1">{{ svc.runs().length }}</p>
              <p class="text-gray-600 text-sm mt-1">activities</p>
            </div>
            <div class="bg-green-50 p-3 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Average Pace</p>
              <p class="text-3xl text-gray-900 mt-1">{{ formatPace(svc.averagePace()) }}</p>
              <p class="text-gray-600 text-sm mt-1">per mile</p>
            </div>
            <div class="bg-purple-50 p-3 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Active Shoes</p>
              <p class="text-3xl text-gray-900 mt-1">{{ svc.shoes().length }}</p>
              <p class="text-gray-600 text-sm mt-1">pairs</p>
            </div>
            <div class="bg-orange-50 p-3 rounded-full">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Runs -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl text-gray-900">Recent Runs</h2>
              <a routerLink="/runs" class="text-blue-600 hover:text-blue-700 text-sm">View all</a>
            </div>
          </div>
          <div class="divide-y divide-gray-200">
            @if (recentRuns().length > 0) {
              @for (run of recentRuns(); track run.id) {
                <div class="p-4 hover:bg-gray-50">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <p class="text-gray-900">{{ run.distance }} miles</p>
                        <span class="text-gray-400">•</span>
                        <p class="text-gray-600 text-sm">{{ formatDuration(run.duration) }}</p>
                      </div>
                      <p class="text-gray-500 text-sm mt-1">{{ run.route || 'No route specified' }}</p>
                      @if (svc.findShoe(run.shoeId); as shoe) {
                        <p class="text-gray-400 text-xs mt-1">{{ shoe.brand }} {{ shoe.model }}</p>
                      }
                    </div>
                    <div class="text-right">
                      <p class="text-gray-600 text-sm">{{ formatPace(run.pace) }}/mi</p>
                      <p class="text-gray-400 text-xs mt-1">{{ run.date | date:'mediumDate' }}</p>
                    </div>
                  </div>
                </div>
              }
            } @else {
              <div class="p-8 text-center text-gray-500">No runs logged yet</div>
            }
          </div>
        </div>

        <!-- Shoes Summary -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl text-gray-900">Your Shoes</h2>
              <a routerLink="/shoes" class="text-blue-600 hover:text-blue-700 text-sm">Manage</a>
            </div>
          </div>
          <div class="divide-y divide-gray-200">
            @if (svc.shoes().length > 0) {
              @for (shoe of svc.shoes(); track shoe.id) {
                <div class="p-4 hover:bg-gray-50">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <p class="text-gray-900">{{ shoe.brand }} {{ shoe.model }}</p>
                      <p class="text-gray-500 text-sm mt-1">{{ shoe.color }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-gray-900">{{ shoe.totalMiles.toFixed(1) }} mi</p>
                      <p class="text-gray-400 text-xs mt-1">
                        {{ shoe.totalMiles >= 300 ? '⚠️ Consider replacing' :
                           shoe.totalMiles >= 200 ? '🟡 High mileage' : '✓ Good' }}
                      </p>
                    </div>
                  </div>
                </div>
              }
            } @else {
              <div class="p-8 text-center text-gray-500">No shoes added yet</div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  svc = inject(RunningService);

  recentRuns = computed(() => this.svc.runs().slice(0, 5));

  formatPace(pace: number): string {
    if (!pace) return '--';
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

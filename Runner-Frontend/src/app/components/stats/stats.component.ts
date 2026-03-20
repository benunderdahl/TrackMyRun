import { Component, inject, computed } from '@angular/core';
import { RunningService } from '../../services/running.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  template: `
    <div class="space-y-8">
      <h1 class="text-3xl text-gray-900">Statistics</h1>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-gray-500 text-sm">Total Distance</p>
          <p class="text-2xl text-gray-900 mt-1">{{ totalDistance().toFixed(1) }}</p>
          <p class="text-gray-600 text-xs mt-1">miles</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-gray-500 text-sm">Total Runs</p>
          <p class="text-2xl text-gray-900 mt-1">{{ svc.runs().length }}</p>
          <p class="text-gray-600 text-xs mt-1">activities</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-gray-500 text-sm">Avg Distance</p>
          <p class="text-2xl text-gray-900 mt-1">{{ avgDistance().toFixed(1) }}</p>
          <p class="text-gray-600 text-xs mt-1">miles</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-gray-500 text-sm">Avg Pace</p>
          <p class="text-2xl text-gray-900 mt-1">{{ formatPace(svc.averagePace()) }}</p>
          <p class="text-gray-600 text-xs mt-1">per mile</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-gray-500 text-sm">Longest Run</p>
          <p class="text-2xl text-gray-900 mt-1">{{ longestRun().toFixed(1) }}</p>
          <p class="text-gray-600 text-xs mt-1">miles</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-gray-500 text-sm">Fastest Pace</p>
          <p class="text-2xl text-gray-900 mt-1">{{ fastestPace() > 0 ? formatPace(fastestPace()) : '--' }}</p>
          <p class="text-gray-600 text-xs mt-1">per mile</p>
        </div>
      </div>

      @if (svc.runs().length > 0) {
        <!-- Monthly Distance Bar Chart -->
        @if (monthlyData().length > 0) {
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl text-gray-900 mb-6">Monthly Distance</h2>
            <div class="flex items-end gap-3 h-48">
              @for (item of monthlyData(); track item.month) {
                <div class="flex-1 flex flex-col items-center gap-2">
                  <span class="text-xs text-gray-500">{{ item.distance.toFixed(0) }}mi</span>
                  <div class="w-full bg-blue-500 rounded-t transition-all"
                    [style.height.%]="getBarHeight(item.distance, maxMonthlyDistance())">
                  </div>
                  <span class="text-xs text-gray-500 text-center leading-tight">{{ item.month }}</span>
                </div>
              }
            </div>
          </div>
        }

        <!-- Pace Trend Line Chart -->
        @if (paceData().length > 1) {
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl text-gray-900 mb-6">Recent Pace Trend</h2>
            <div class="relative h-48">
              <svg class="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                <polyline
                  [attr.points]="pacePolyline()"
                  fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linejoin="round"/>
                @for (pt of pacePoints(); track $index) {
                  <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="4" fill="#8b5cf6"/>
                }
              </svg>
              <div class="flex justify-between mt-2">
                @for (item of paceData(); track $index) {
                  <span class="text-xs text-gray-500">{{ item.date }}</span>
                }
              </div>
            </div>
          </div>
        }

        <!-- Shoe Usage Horizontal Bar Chart -->
        @if (shoeStats().length > 0) {
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl text-gray-900 mb-6">Shoe Usage</h2>
            <div class="space-y-4">
              @for (shoe of shoeStats(); track shoe.name) {
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-600 w-44 truncate">{{ shoe.name }}</span>
                  <div class="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div class="bg-emerald-500 h-full rounded-full transition-all"
                      [style.width.%]="(shoe.miles / maxShoeMiles()) * 100">
                    </div>
                  </div>
                  <span class="text-sm text-gray-700 w-16 text-right">{{ shoe.miles }} mi</span>
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <p class="text-gray-500">No data available yet. Start logging runs to see statistics!</p>
        </div>
      }
    </div>
  `
})
export class StatsComponent {
  svc = inject(RunningService);

  totalDistance = computed(() => this.svc.runs().reduce((s, r) => s + r.distance, 0));
  avgDistance = computed(() => this.svc.runs().length ? this.totalDistance() / this.svc.runs().length : 0);
  longestRun = computed(() => this.svc.runs().length ? Math.max(...this.svc.runs().map(r => r.distance)) : 0);
  fastestPace = computed(() => this.svc.runs().length ? Math.min(...this.svc.runs().map(r => r.pace)) : 0);

  monthlyData = computed(() => {
    const map: Record<string, { month: string; distance: number; runs: number }> = {};
    for (const run of this.svc.runs()) {
      const month = new Date(run.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!map[month]) map[month] = { month, distance: 0, runs: 0 };
      map[month].distance += run.distance;
      map[month].runs++;
    }
    return Object.values(map);
  });

  maxMonthlyDistance = computed(() =>
    this.monthlyData().length ? Math.max(...this.monthlyData().map(d => d.distance)) : 1
  );

  paceData = computed(() =>
    this.svc.runs().slice(0, 10).reverse().map((run, i) => ({
      run: `Run ${i + 1}`,
      pace: run.pace,
      date: new Date(run.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))
  );

  pacePoints = computed(() => {
    const data = this.paceData();
    if (!data.length) return [];
    const paces = data.map(d => d.pace);
    const minP = Math.min(...paces) - 0.5;
    const maxP = Math.max(...paces) + 0.5;
    return data.map((d, i) => ({
      x: (i / (data.length - 1)) * 380 + 10,
      y: 150 - ((d.pace - minP) / (maxP - minP)) * 130
    }));
  });

  pacePolyline = computed(() =>
    this.pacePoints().map(p => `${p.x},${p.y}`).join(' ')
  );

  shoeStats = computed(() =>
    this.svc.shoes()
      .map(shoe => ({
        name: `${shoe.brand} ${shoe.model}`,
        miles: parseFloat(shoe.totalMiles.toFixed(1)),
        runs: this.svc.getRunsForShoe(shoe.id).length
      }))
      .sort((a, b) => b.miles - a.miles)
  );

  maxShoeMiles = computed(() =>
    this.shoeStats().length ? Math.max(...this.shoeStats().map(s => s.miles)) : 1
  );

  getBarHeight(value: number, max: number): number {
    return max > 0 ? (value / max) * 100 : 0;
  }

  formatPace(pace: number): string {
    if (!pace) return '--';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

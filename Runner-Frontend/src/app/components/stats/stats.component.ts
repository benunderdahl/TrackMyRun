import { Component, inject, signal, computed } from '@angular/core';
import { RunningService } from '../../services/running.service';

type FilterMode = 'all' | 'week' | 'month';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.component.html'
})
export class StatsComponent {
  svc = inject(RunningService);

  // ── Filter state ─────────────────────────────────────────
  filterMode    = signal<FilterMode>('all');
  selectedYear  = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth());
  selectedWeek  = signal(this.getWeekStart(new Date()));

  // ── Filtered runs ─────────────────────────────────────────
  filteredRuns = computed(() => {
    const mode = this.filterMode();
    const runs = this.svc.runs();

    if (mode === 'all') return runs;

    if (mode === 'month') {
      return runs.filter(run => {
        const parts = (run.date as string).split('-');
        const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        return d.getFullYear() === this.selectedYear() &&
               d.getMonth()    === this.selectedMonth();
      });
    }

    if (mode === 'week') {
      const weekStart = this.selectedWeek();
      const weekEnd   = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return runs.filter(run => {
        const parts = (run.date as string).split('-');
        const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        return d >= weekStart && d <= weekEnd;
      });
    }

    return runs;
  });

  // ── Summary stats ─────────────────────────────────────────
  totalDistance = computed(() =>
    this.filteredRuns().reduce((s, r) => s + Number(r.distance), 0)
  );

  avgDistance = computed(() =>
    this.filteredRuns().length ? this.totalDistance() / this.filteredRuns().length : 0
  );

  longestRun = computed(() =>
    this.filteredRuns().length ? Math.max(...this.filteredRuns().map(r => Number(r.distance))) : 0
  );

  fastestPace = computed(() =>
    this.filteredRuns().length ? Math.min(...this.filteredRuns().map(r => Number(r.pace))) : 0
  );

  averagePace = computed(() => {
    const runs = this.filteredRuns();
    if (!runs.length) return 0;
    return runs.reduce((s, r) => s + Number(r.pace), 0) / runs.length;
  });

  // ── Monthly bar chart ─────────────────────────────────────
  monthlyData = computed(() => {
    const map: Record<string, { month: string; distance: number }> = {};
    for (const run of this.svc.runs()) {
      const parts = (run.date as string).split('-');
      const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      const month = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!map[month]) map[month] = { month, distance: 0 };
      map[month].distance += Number(run.distance);
    }
    return Object.values(map).slice(-6);
  });

  maxMonthlyDistance = computed(() =>
    this.monthlyData().length ? Math.max(...this.monthlyData().map(d => d.distance)) : 1
  );

  // ── Weekly bar chart ──────────────────────────────────────
  weeklyData = computed(() => {
    const map: Record<string, { week: string; distance: number }> = {};
    const runs = this.filterMode() === 'all' ? this.svc.runs() : this.filteredRuns();
    for (const run of runs) {
      const parts = (run.date as string).split('-');
      const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      const key = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!map[key]) map[key] = { week: key, distance: 0 };
      map[key].distance += Number(run.distance);
    }
    return Object.values(map).slice(-8);
  });

  maxWeeklyDistance = computed(() =>
    this.weeklyData().length ? Math.max(...this.weeklyData().map(d => d.distance)) : 1
  );

  // ── Pace trend ────────────────────────────────────────────
  paceData = computed(() =>
    [...this.filteredRuns()]
      .sort((a, b) => {
        const pa = (a.date as string).split('-');
        const pb = (b.date as string).split('-');
        return new Date(+pa[0], +pa[1]-1, +pa[2]).getTime() -
               new Date(+pb[0], +pb[1]-1, +pb[2]).getTime();
      })
      .slice(-10)
      .map(run => ({
        pace: Number(run.pace),
        date: (() => {
          const p = (run.date as string).split('-');
          return new Date(+p[0], +p[1]-1, +p[2])
            .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        })()
      }))
  );

  pacePoints = computed(() => {
    const data = this.paceData();
    if (data.length < 2) return [];
    const paces = data.map(d => d.pace);
    const minP = Math.min(...paces) - 0.5;
    const maxP = Math.max(...paces) + 0.5;
    return data.map((d, i) => ({
      x: 50 + (i / (data.length - 1)) * 530,
      y: 130 - ((d.pace - minP) / (maxP - minP)) * 120
    }));
  });

  pacePolyline = computed(() =>
    this.pacePoints().map(p => `${p.x},${p.y}`).join(' ')
  );

  paceFillPath = computed(() => {
    const pts = this.pacePoints();
    if (!pts.length) return '';
    const linePts = pts.map(p => `${p.x},${p.y}`).join(' L ');
    return `M${pts[0].x},140 L ${linePts} L${pts[pts.length - 1].x},140 Z`;
  });

  paceYLabels = computed(() => {
    const data = this.paceData();
    if (!data.length) return [];
    const paces = data.map(d => d.pace);
    const minP = Math.min(...paces) - 0.5;
    const maxP = Math.max(...paces) + 0.5;
    return [0, 1, 2, 3].map(i => {
      const pace = maxP - (i / 3) * (maxP - minP);
      return this.formatPace(pace);
    });
  });

  paceImprovement = computed(() => {
    const data = this.paceData();
    if (data.length < 2) return null;
    return data[data.length - 1].pace - data[0].pace;
  });

  // ── Distance distribution ─────────────────────────────────
  distanceDistribution = computed(() => {
    const buckets = [
      { label: '< 2 mi',    min: 0,  max: 2,    count: 0 },
      { label: '2 – 4 mi',  min: 2,  max: 4,    count: 0 },
      { label: '4 – 6 mi',  min: 4,  max: 6,    count: 0 },
      { label: '6 – 10 mi', min: 6,  max: 10,   count: 0 },
      { label: '10+ mi',    min: 10, max: 9999,  count: 0 },
    ];
    for (const run of this.filteredRuns()) {
      const d = Number(run.distance);
      const bucket = buckets.find(b => d >= b.min && d < b.max);
      if (bucket) bucket.count++;
    }
    return buckets;
  });

  maxBucketCount = computed(() =>
    Math.max(...this.distanceDistribution().map(b => b.count), 1)
  );

  // ── Shoe usage ────────────────────────────────────────────
  shoeStats = computed(() =>
    this.svc.shoes()
      .map(shoe => ({
        name: `${shoe.brand} ${shoe.model}`,
        miles: Number(shoe.totalMiles)
      }))
      .sort((a, b) => b.miles - a.miles)
  );

  maxShoeMiles = computed(() =>
    this.shoeStats().length ? Math.max(...this.shoeStats().map(s => s.miles)) : 1
  );

  // ── Period labels ─────────────────────────────────────────
  weekLabel = computed(() => {
    const start = this.selectedWeek();
    const end   = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(start)} – ${fmt(end)}`;
  });

  monthLabel = computed(() =>
    new Date(this.selectedYear(), this.selectedMonth(), 1)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  );

  periodLabel = computed(() => {
    if (this.filterMode() === 'week')  return this.weekLabel();
    if (this.filterMode() === 'month') return this.monthLabel();
    return 'All Time';
  });

  isCurrentPeriod = computed(() => {
    const now = new Date();
    if (this.filterMode() === 'month') {
      return this.selectedYear()  === now.getFullYear() &&
             this.selectedMonth() === now.getMonth();
    }
    return this.selectedWeek().getTime() >= this.getWeekStart(now).getTime();
  });

  // ── Navigation ────────────────────────────────────────────
  setMode(mode: FilterMode): void {
    this.filterMode.set(mode);
  }

  prevPeriod(): void {
    if (this.filterMode() === 'month') {
      if (this.selectedMonth() === 0) {
        this.selectedMonth.set(11);
        this.selectedYear.update(y => y - 1);
      } else {
        this.selectedMonth.update(m => m - 1);
      }
    } else {
      const prev = new Date(this.selectedWeek());
      prev.setDate(prev.getDate() - 7);
      this.selectedWeek.set(prev);
    }
  }

  nextPeriod(): void {
    if (this.filterMode() === 'month') {
      if (this.selectedMonth() === 11) {
        this.selectedMonth.set(0);
        this.selectedYear.update(y => y + 1);
      } else {
        this.selectedMonth.update(m => m + 1);
      }
    } else {
      const next = new Date(this.selectedWeek());
      next.setDate(next.getDate() + 7);
      this.selectedWeek.set(next);
    }
  }

  goToCurrent(): void {
    const now = new Date();
    this.selectedYear.set(now.getFullYear());
    this.selectedMonth.set(now.getMonth());
    this.selectedWeek.set(this.getWeekStart(now));
  }

  // ── Helpers ───────────────────────────────────────────────
  getWeekStart(date: Date): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Returns pixels (max 100px) for bar height
  getBarHeight(value: number, max: number): number {
    if (max <= 0) return 4;
    return Math.max((value / max) * 100, 4);
  }

  formatPace(pace: number): string {
    if (!pace || pace <= 0) return '--';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatPaceDiff(diff: number): string {
    const abs = Math.abs(diff);
    const minutes = Math.floor(abs);
    const seconds = Math.round((abs - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
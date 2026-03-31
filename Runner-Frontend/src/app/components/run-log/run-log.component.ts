import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RunningService } from '../../services/running.service';
import { DatePipe } from '@angular/common';

type FilterMode = 'all' | 'week' | 'month';

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
  templateUrl: `./run-log.component.html`
})
export class RunLogComponent {
  svc      = inject(RunningService);
  showForm = signal(false);
  form: RunForm = this.defaultForm();
 
  // ── Filter state ─────────────────────────────────────────
  filterMode    = signal<FilterMode>('all');
  selectedYear  = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth()); // 0-indexed
  selectedWeek  = signal(this.getWeekStart(new Date()));
 
  // ── Filtered runs ─────────────────────────────────────────
  filteredRuns = computed(() => {
    const mode = this.filterMode();
    const runs = this.svc.runs();
 
    if (mode === 'all') return runs;
 
    if (mode === 'month') {
      return runs.filter(run => {
        const d = new Date(run.date);
        return d.getFullYear() === this.selectedYear() &&
               d.getMonth()    === this.selectedMonth();
      });
    }
 
    if (mode === 'week') {
      const weekStart = this.selectedWeek();
      const weekEnd   = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return runs.filter(run => {
        const d = new Date(run.date);
        return d >= weekStart && d <= weekEnd;
      });
    }
 
    return runs;
  });
 
  periodDistance = computed(() =>
    this.filteredRuns().reduce((s, r) => s + Number(r.distance), 0)
  );
 
  periodAvgPace = computed(() => {
    const runs = this.filteredRuns();
    if (!runs.length) return 0;
    return runs.reduce((s, r) => s + Number(r.pace), 0) / runs.length;
  });
 
  // ── Labels ───────────────────────────────────────────────
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
 
  // ── Navigation ───────────────────────────────────────────
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
 
  isCurrentPeriod = computed(() => {
    const now = new Date();
    if (this.filterMode() === 'month') {
      return this.selectedYear()  === now.getFullYear() &&
             this.selectedMonth() === now.getMonth();
    }
    const currentWeek = this.getWeekStart(now).getTime();
    return this.selectedWeek().getTime() >= currentWeek;
  });
 
  // ── Form ─────────────────────────────────────────────────
  defaultForm(): RunForm {
    return {
      date: new Date().toISOString().split('T')[0],
      distance: '', duration: '', shoeId: '', route: '', notes: ''
    };
  }
 
  toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.form = this.defaultForm();
  }
 
  submitRun(): void {
    if (!this.form.distance || !this.form.duration || !this.form.shoeId) return;
    this.svc.addRun({
      date:     this.form.date,
      distance: parseFloat(this.form.distance),
      duration: parseFloat(this.form.duration),
      shoeId:   Number(this.form.shoeId),
      route:    this.form.route,
      notes:    this.form.notes
    });
    this.form = this.defaultForm();
    this.showForm.set(false);
  }
 
  // ── Helpers ──────────────────────────────────────────────
  getWeekStart(date: Date): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay()); // Sunday
    d.setHours(0, 0, 0, 0);
    return d;
  }
 
  formatPace(pace: number): string {
    if (!pace) return '--';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
 
  formatDuration(minutes: number): string {
    const hrs  = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }
}
import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RunLogComponent } from './components/run-log/run-log.component';
import { ShoesComponent } from './components/shoes/shoes.component';
import { StatsComponent } from './components/stats/stats.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'runs', component: RunLogComponent },
  { path: 'shoes', component: ShoesComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: '' }
];

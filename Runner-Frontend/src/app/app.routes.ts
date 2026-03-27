import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RunLogComponent } from './components/run-log/run-log.component';
import { ShoesComponent } from './components/shoes/shoes.component';
import { StatsComponent } from './components/stats/stats.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],   // protect all app routes
    children: [
      { path: '',      component: DashboardComponent },
      { path: 'runs',  component: RunLogComponent },
      { path: 'shoes', component: ShoesComponent },
      { path: 'stats', component: StatsComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];

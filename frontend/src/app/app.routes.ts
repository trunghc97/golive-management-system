import { Routes } from '@angular/router';
import { ChangesListComponent } from './components/changes-list/changes-list.component';
import { TimelineDayComponent } from './components/timeline-day/timeline-day.component';
import { ComponentHistoryComponent } from './components/component-history/component-history.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard/changes' },
  // Dashboard 3 tabs
  { path: 'dashboard/changes', component: ChangesListComponent },
  { path: 'dashboard/timeline', component: TimelineDayComponent },
  { path: 'dashboard/components', component: ComponentHistoryComponent },
  // Existing pages
  { path: 'timeline', loadComponent: () => import('./pages/timeline.component').then(m => m.TimelineComponent) },
  { path: 'register', loadComponent: () => import('./pages/register.component').then(m => m.RegisterComponent) },
  { path: 'rollback/:id', loadComponent: () => import('./pages/rollback.component').then(m => m.RollbackComponent) },
  { path: 'history/:changeId', loadComponent: () => import('./pages/history.component').then(m => m.HistoryComponent) },
  { path: 'status/:id', loadComponent: () => import('./pages/status.component').then(m => m.StatusComponent) },
  { path: '**', redirectTo: 'dashboard/changes' },
];



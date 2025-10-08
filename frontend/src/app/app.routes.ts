import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'timeline', pathMatch: 'full' },
  { path: 'timeline', loadComponent: () => import('./pages/timeline.component').then(m => m.TimelineComponent) },
  { path: 'register', loadComponent: () => import('./pages/register.component').then(m => m.RegisterComponent) },
  { path: 'rollback/:id', loadComponent: () => import('./pages/rollback.component').then(m => m.RollbackComponent) },
  { path: 'history/:changeId', loadComponent: () => import('./pages/history.component').then(m => m.HistoryComponent) },
  { path: 'status/:id', loadComponent: () => import('./pages/status.component').then(m => m.StatusComponent) },
];



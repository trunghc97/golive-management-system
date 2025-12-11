import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'changes',
        loadComponent: () => import('./components/change-list/change-list.component').then(m => m.ChangeListComponent)
    },
    {
        path: 'services',
        loadComponent: () => import('./components/service-catalog/service-catalog.component').then(m => m.ServiceCatalogComponent)
    },
    {
        path: 'impact-analysis',
        loadComponent: () => import('./components/impact-analysis/impact-analysis.component').then(m => m.ImpactAnalysisComponent)
    }
];

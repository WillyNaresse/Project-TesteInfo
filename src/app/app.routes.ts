import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'registry',
    loadComponent: () => import('./pages/registry/registry.component').then((m) => m.RegistryComponent)
  },
  {
    path: 'registry/:id',
    loadComponent: () => import('./pages/registry/registry.component').then((m) => m.RegistryComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

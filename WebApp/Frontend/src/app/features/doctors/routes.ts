import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./views/doctors-list.component').then(m => m.DoctorsListComponent) },
  { path: 'create', loadComponent: () => import('./views/doctors-edit.component').then(m => m.DoctorsEditComponent) },
  { path: ':id', loadComponent: () => import('./views/doctors-edit.component').then(m => m.DoctorsEditComponent) }
];
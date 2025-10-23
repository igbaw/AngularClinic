import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./views/patients-list.component').then(m => m.PatientsListComponent) },
  { path: 'create', loadComponent: () => import('./views/patients-edit.component').then(m => m.PatientsEditComponent) },
  { path: ':id', loadComponent: () => import('./views/patients-edit.component').then(m => m.PatientsEditComponent) }
];
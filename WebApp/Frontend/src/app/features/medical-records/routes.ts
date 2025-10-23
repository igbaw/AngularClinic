import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./views/medical-records-list.component').then(m => m.MedicalRecordsListComponent) },
  { path: 'create', loadComponent: () => import('./views/medical-records-edit.component').then(m => m.MedicalRecordsEditComponent) },
  { path: ':id', loadComponent: () => import('./views/medical-records-edit.component').then(m => m.MedicalRecordsEditComponent) }
];
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./views/appointments-calendar.component').then(m => m.AppointmentsCalendarComponent) }
];
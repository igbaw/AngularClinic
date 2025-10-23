import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  { name: 'Dashboard', url: '/dashboard', iconComponent: { name: 'cil-speedometer' } },
  { title: true, name: 'Clinic' },
  { name: 'Patients', url: '/patients', iconComponent: { name: 'cil-people' } },
  { name: 'Doctors', url: '/doctors', iconComponent: { name: 'cil-user' } },
  { name: 'Appointments', url: '/appointments', iconComponent: { name: 'cil-calendar' } },
  { name: 'Medical Records', url: '/medical-records', iconComponent: { name: 'cil-notes' } }
];

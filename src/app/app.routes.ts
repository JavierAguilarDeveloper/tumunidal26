import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/main/main.component').then(m => m.MainComponent),
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./pages/privacidad/privacidad.component').then(m => m.PrivacidadComponent),
  },
  {
    path: 'acerca',
    loadComponent: () => import('./pages/acerca/acerca.component').then(m => m.AcercaComponent),
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto.component').then(m => m.ContactoComponent),
  },
  { path: '**', redirectTo: '' },
];

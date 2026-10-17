import { Routes } from '@angular/router';
import { Home } from './components/home/home.component';
import { Dashboard } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: Home, title: 'Snip | Short URL & QR Generator' },
  { path: 'dashboard', component: Dashboard, title: 'Snip | Dashboard' },
  { path: '**', redirectTo: '' },
];

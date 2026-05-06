import { Routes } from '@angular/router';

import { It01Component } from './pages/it01/it01';
import { It03Component } from './pages/it03/it03';
import { No9Component } from './pages/no9/no9';

export const routes: Routes = [
  { path: '', redirectTo: 'it01', pathMatch: 'full' },
  { path: 'it01', component: It01Component },
  { path: 'it03', component: It03Component },
  { path: 'no9', component: No9Component },
];

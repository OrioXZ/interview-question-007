import { Routes } from '@angular/router';

import { It01Component } from './pages/it01/it01';
import { It03Component } from './pages/it03/it03';
import { It04Component } from './pages/it04/it04';
import { No9Component } from './pages/no9/no9';

export const routes: Routes = [
  { path: '', redirectTo: 'it04', pathMatch: 'full' },
  { path: 'it01', component: It01Component },
  { path: 'it03', component: It03Component },
  { path: 'it04', component: It04Component },
  { path: 'no9', component: No9Component },
];

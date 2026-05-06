import { Routes } from '@angular/router';

import { It01Component } from './pages/it01/it01';
import { It02Component } from './pages/it02/it02';
import { It03Component } from './pages/it03/it03';
import { It04Component } from './pages/it04/it04';
import { It05Component } from './pages/it05/it05';
import { It08Component } from './pages/it08/it08';
import { It10Component } from './pages/it10/it10';
import { No6Component } from './pages/no6/no6';
import { No7Component } from './pages/no7/no7';
import { No9Component } from './pages/no9/no9';

export const routes: Routes = [
  { path: '', redirectTo: 'it02', pathMatch: 'full' },
  { path: 'it01', component: It01Component },
  { path: 'it02', component: It02Component },
  { path: 'it03', component: It03Component },
  { path: 'it04', component: It04Component },
  { path: 'it05', component: It05Component },
  { path: 'it08', component: It08Component },
  { path: 'it10', component: It10Component },
  { path: 'no6', component: No6Component },
  { path: 'no7', component: No7Component },
  { path: 'no9', component: No9Component },
];

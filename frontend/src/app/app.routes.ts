import { Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing';
import { It01Component } from './pages/it01/it01';
import { It02Component } from './pages/it02/it02';
import { It03Component } from './pages/it03/it03';
import { It04Component } from './pages/it04/it04';
import { It05Component } from './pages/it05/it05';
import { It06Component } from './pages/it06/it06';
import { It07Component } from './pages/it07/it07';
import { It08Component } from './pages/it08/it08';
import { It09Component } from './pages/it09/it09';
import { It10Component } from './pages/it10/it10';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'it01', component: It01Component },
  { path: 'it02', component: It02Component },
  { path: 'it03', component: It03Component },
  { path: 'it04', component: It04Component },
  { path: 'it05', component: It05Component },
  { path: 'it06', component: It06Component },
  { path: 'it07', component: It07Component },
  { path: 'it08', component: It08Component },
  { path: 'it09', component: It09Component },
  { path: 'it10', component: It10Component },
  { path: 'no6', redirectTo: 'it06', pathMatch: 'full' },
  { path: 'no7', redirectTo: 'it07', pathMatch: 'full' },
  { path: 'no9', redirectTo: 'it09', pathMatch: 'full' },
];

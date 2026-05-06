import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CreateIt04Profile, It04Profile } from '../models/it04-profile.model';

@Injectable({ providedIn: 'root' })
export class It04Service {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  createProfile(body: CreateIt04Profile) {
    return this.http.post<It04Profile>(`${this.baseUrl}/profiles`, body);
  }
}

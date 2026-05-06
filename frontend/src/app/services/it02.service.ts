import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  It02LoginBody,
  It02LoginResponse,
  It02RegisterBody,
  It02UserResponse,
} from '../models/it02-auth.model';

@Injectable({ providedIn: 'root' })
export class It02Service {
  private readonly baseUrl = 'http://localhost:8080/auth';

  constructor(private readonly http: HttpClient) {}

  register(body: It02RegisterBody) {
    return this.http.post<It02UserResponse>(`${this.baseUrl}/register`, body);
  }

  login(body: It02LoginBody) {
    return this.http.post<It02LoginResponse>(`${this.baseUrl}/login`, body);
  }

  currentUser(token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<It02UserResponse>(`${this.baseUrl}/me`, { headers });
  }
}

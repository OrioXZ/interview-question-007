import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { It05QueueResponse } from '../models/it05-queue.model';

@Injectable({ providedIn: 'root' })
export class It05Service {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  currentQueue() {
    return this.http.get<It05QueueResponse>(`${this.baseUrl}/queue/current`);
  }

  nextQueue() {
    return this.http.post<It05QueueResponse>(`${this.baseUrl}/queue/next`, {});
  }

  clearQueue() {
    return this.http.post<It05QueueResponse>(`${this.baseUrl}/queue/clear`, {});
  }
}

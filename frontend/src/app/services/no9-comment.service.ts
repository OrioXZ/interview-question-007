import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { No9Comment } from '../models/no9-comment.model';

@Injectable({ providedIn: 'root' })
export class No9CommentService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getComments() {
    return this.http
      .get<{ items: No9Comment[] }>(`${this.baseUrl}/comments`)
      .pipe(map((res) => res.items ?? []));
  }

  createComment(message: string) {
    return this.http.post<No9Comment>(`${this.baseUrl}/comments`, {
      commenter: 'Blend 285',
      message,
    });
  }
}

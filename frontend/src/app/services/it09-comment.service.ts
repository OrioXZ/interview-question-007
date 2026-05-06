import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { It09Comment } from '../models/it09-comment.model';

@Injectable({ providedIn: 'root' })
export class It09CommentService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getComments() {
    return this.http
      .get<{ items: It09Comment[] }>(`${this.baseUrl}/comments`)
      .pipe(map((res) => res.items ?? []));
  }

  createComment(message: string) {
    return this.http.post<It09Comment>(`${this.baseUrl}/comments`, {
      commenter: 'Blend 285',
      message,
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { It08Question } from '../models/it08-question.model';

@Injectable({ providedIn: 'root' })
export class It08Service {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getQuestions() {
    return this.http
      .get<{ items: It08Question[] }>(`${this.baseUrl}/questions`)
      .pipe(map((res) => res.items ?? []));
  }

  createQuestion(text: string) {
    return this.http.post<It08Question>(`${this.baseUrl}/questions`, { text });
  }

  deleteQuestion(id: number) {
    return this.http.delete(`${this.baseUrl}/questions/${id}`);
  }
}

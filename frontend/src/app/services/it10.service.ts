import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { It10ExamResult, It10Question } from '../models/it10-exam.model';

@Injectable({ providedIn: 'root' })
export class It10Service {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getQuestions() {
    return this.http
      .get<{ items: It10Question[] }>(`${this.baseUrl}/exam/questions`)
      .pipe(map((res) => res.items ?? []));
  }

  submitExam(testerName: string, answers: { question_id: number; option_id: number }[]) {
    return this.http.post<It10ExamResult>(`${this.baseUrl}/exam/submissions`, {
      tester_name: testerName,
      answers,
    });
  }
}

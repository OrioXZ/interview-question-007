import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { CreateIt01Person, It01Person } from '../models/it01-person.model';

@Injectable({ providedIn: 'root' })
export class It01Service {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getPeople() {
    return this.http
      .get<{ items: It01Person[] }>(`${this.baseUrl}/personal-infos`)
      .pipe(map((res) => res.items ?? []));
  }

  createPerson(body: CreateIt01Person) {
    return this.http.post<It01Person>(`${this.baseUrl}/personal-infos`, body);
  }
}

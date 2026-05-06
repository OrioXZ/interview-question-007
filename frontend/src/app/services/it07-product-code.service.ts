import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { It07ProductCode } from '../models/it07-product-code.model';

@Injectable({ providedIn: 'root' })
export class It07ProductCodeService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getProductCodes() {
    return this.http
      .get<{ items: It07ProductCode[] }>(`${this.baseUrl}/qr-products`)
      .pipe(map((res) => res.items ?? []));
  }

  createProductCode(code: string) {
    return this.http.post<It07ProductCode>(`${this.baseUrl}/qr-products`, { code });
  }

  deleteProductCode(id: number) {
    return this.http.delete(`${this.baseUrl}/qr-products/${id}`);
  }
}

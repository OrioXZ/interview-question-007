import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { No7ProductCode } from '../models/no7-product-code.model';

@Injectable({ providedIn: 'root' })
export class No7ProductCodeService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getProductCodes() {
    return this.http
      .get<{ items: No7ProductCode[] }>(`${this.baseUrl}/qr-products`)
      .pipe(map((res) => res.items ?? []));
  }

  createProductCode(code: string) {
    return this.http.post<No7ProductCode>(`${this.baseUrl}/qr-products`, { code });
  }

  deleteProductCode(id: number) {
    return this.http.delete(`${this.baseUrl}/qr-products/${id}`);
  }
}

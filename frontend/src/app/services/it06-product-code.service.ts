import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { It06ProductCode } from '../models/it06-product-code.model';

@Injectable({ providedIn: 'root' })
export class It06ProductCodeService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getProductCodes() {
    return this.http
      .get<{ items: It06ProductCode[] }>(`${this.baseUrl}/barcode-products`)
      .pipe(map((res) => res.items ?? []));
  }

  createProductCode(code: string) {
    return this.http.post<It06ProductCode>(`${this.baseUrl}/barcode-products`, { code });
  }

  deleteProductCode(id: number) {
    return this.http.delete(`${this.baseUrl}/barcode-products/${id}`);
  }
}

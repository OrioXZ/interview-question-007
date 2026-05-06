import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { It07ProductCode } from '../../models/it07-product-code.model';
import { It07ProductCodeService } from '../../services/it07-product-code.service';

@Component({
  selector: 'app-it07',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './it07.html',
  styleUrls: ['./it07.scss'],
})
export class It07Component {
  products = signal<It07ProductCode[]>([]);
  codeInput = signal('');
  selectedProduct = signal<It07ProductCode | null>(null);
  qrRows = computed(() => this.qrMatrix(this.selectedProduct()?.code ?? ''));

  constructor(private productService: It07ProductCodeService) {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProductCodes().subscribe({
      next: (products) => this.products.set(products),
      error: () => this.products.set([]),
    });
  }

  updateCodeInput(value: string) {
    const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 30);
    this.codeInput.set(this.formatCode(normalized));
  }

  addProductCode() {
    const normalized = this.normalizedCode(this.codeInput());
    if (!/^[A-Z0-9]{30}$/.test(normalized)) {
      alert('Code must be 30 uppercase letters or numbers');
      return;
    }

    this.productService.createProductCode(this.formatCode(normalized)).subscribe({
      next: (product) => {
        this.products.update((items) => [...items, product]);
        this.codeInput.set('');
      },
      error: (err) => alert(err?.error?.error || 'Save failed'),
    });
  }

  openQR(product: It07ProductCode) {
    this.selectedProduct.set(product);
  }

  closeQR() {
    this.selectedProduct.set(null);
  }

  deleteProductCode(product: It07ProductCode) {
    if (!confirm(`Delete ${this.formatCode(product.code)}?`)) return;

    this.productService.deleteProductCode(product.id).subscribe({
      next: () => this.products.update((items) => items.filter((item) => item.id !== product.id)),
      error: (err) => alert(err?.error?.error || 'Delete failed'),
    });
  }

  formatCode(code: string) {
    const normalized = this.normalizedCode(code);
    return normalized.replace(/(.{5})(?=.)/g, '$1-');
  }

  private normalizedCode(code: string) {
    return code.toUpperCase().replace(/-/g, '');
  }

  private qrMatrix(code: string) {
    const size = 29;
    const matrix = Array.from({ length: size }, () => Array.from({ length: size }, () => false));
    const reserved = Array.from({ length: size }, () => Array.from({ length: size }, () => false));

    this.addFinder(matrix, reserved, 0, 0);
    this.addFinder(matrix, reserved, size - 7, 0);
    this.addFinder(matrix, reserved, 0, size - 7);

    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
      reserved[6][i] = true;
      reserved[i][6] = true;
    }

    let hash = 2166136261;
    for (const character of code) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }

    const bits = this.normalizedCode(code)
      .split('')
      .flatMap((character) => character.charCodeAt(0).toString(2).padStart(8, '0').split(''));

    let bitIndex = 0;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (reserved[row][col]) continue;

        hash ^= row * 31 + col * 17 + bitIndex;
        hash = Math.imul(hash, 16777619);
        const dataBit = bits[bitIndex % Math.max(bits.length, 1)] === '1';
        matrix[row][col] = dataBit !== ((hash >>> 3) % 2 === 0);
        bitIndex++;
      }
    }

    return matrix;
  }

  private addFinder(matrix: boolean[][], reserved: boolean[][], x: number, y: number) {
    for (let row = y; row < y + 7; row++) {
      for (let col = x; col < x + 7; col++) {
        const edge = row === y || row === y + 6 || col === x || col === x + 6;
        const center = row >= y + 2 && row <= y + 4 && col >= x + 2 && col <= x + 4;
        matrix[row][col] = edge || center;
        reserved[row][col] = true;
      }
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { It06ProductCode } from '../../models/it06-product-code.model';
import { It06ProductCodeService } from '../../services/it06-product-code.service';

interface BarcodeSegment {
  bar: boolean;
  wide: boolean;
}

@Component({
  selector: 'app-it06',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './it06.html',
  styleUrls: ['./it06.scss'],
})
export class It06Component {
  products = signal<It06ProductCode[]>([]);
  codeInput = signal('');

  private readonly code39Patterns: Record<string, string> = {
    '0': 'nnnwwnwnn',
    '1': 'wnnwnnnnw',
    '2': 'nnwwnnnnw',
    '3': 'wnwwnnnnn',
    '4': 'nnnwwnnnw',
    '5': 'wnnwwnnnn',
    '6': 'nnwwwnnnn',
    '7': 'nnnwnnwnw',
    '8': 'wnnwnnwnn',
    '9': 'nnwwnnwnn',
    A: 'wnnnnwnnw',
    B: 'nnwnnwnnw',
    C: 'wnwnnwnnn',
    D: 'nnnnwwnnw',
    E: 'wnnnwwnnn',
    F: 'nnwnwwnnn',
    G: 'nnnnnwwnw',
    H: 'wnnnnwwnn',
    I: 'nnwnnwwnn',
    J: 'nnnnwwwnn',
    K: 'wnnnnnnww',
    L: 'nnwnnnnww',
    M: 'wnwnnnnwn',
    N: 'nnnnwnnww',
    O: 'wnnnwnnwn',
    P: 'nnwnwnnwn',
    Q: 'nnnnnnwww',
    R: 'wnnnnnwwn',
    S: 'nnwnnnwwn',
    T: 'nnnnwnwwn',
    U: 'wwnnnnnnw',
    V: 'nwwnnnnnw',
    W: 'wwwnnnnnn',
    X: 'nwnnwnnnw',
    Y: 'wwnnwnnnn',
    Z: 'nwwnwnnnn',
    '-': 'nwnnnnwnw',
    '*': 'nwnnwnwnn',
  };

  constructor(private productService: It06ProductCodeService) {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProductCodes().subscribe({
      next: (products) => this.products.set(products),
      error: () => this.products.set([]),
    });
  }

  updateCodeInput(value: string) {
    const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
    this.codeInput.set(this.formatCode(normalized));
  }

  addProductCode() {
    const normalized = this.normalizedCode(this.codeInput());
    if (!/^[A-Z0-9]{16}$/.test(normalized)) {
      alert('Code must be 16 uppercase letters or numbers');
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

  deleteProductCode(product: It06ProductCode) {
    if (!confirm(`Delete ${this.formatCode(product.code)}?`)) return;

    this.productService.deleteProductCode(product.id).subscribe({
      next: () => this.products.update((items) => items.filter((item) => item.id !== product.id)),
      error: (err) => alert(err?.error?.error || 'Delete failed'),
    });
  }

  formatCode(code: string) {
    const normalized = this.normalizedCode(code);
    return normalized.replace(/(.{4})(?=.)/g, '$1-');
  }

  code39Segments(code: string): BarcodeSegment[] {
    const encoded = `*${code}*`;
    const segments: BarcodeSegment[] = [];

    for (const character of encoded) {
      const pattern = this.code39Patterns[character];
      if (!pattern) continue;

      for (let index = 0; index < pattern.length; index++) {
        segments.push({
          bar: index % 2 === 0,
          wide: pattern[index] === 'w',
        });
      }
      segments.push({ bar: false, wide: false });
    }

    return segments;
  }

  private normalizedCode(code: string) {
    return code.toUpperCase().replace(/-/g, '');
  }
}

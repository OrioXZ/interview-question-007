import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreateIt01Person, It01Person } from '../../models/it01-person.model';
import { It01Service } from '../../services/it01.service';

@Component({
  selector: 'app-it01',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './it01.html',
  styleUrls: ['./it01.scss'],
})
export class It01Component {
  people = signal<It01Person[]>([]);
  addOpen = signal(false);
  viewing = signal<It01Person | null>(null);
  form = signal<CreateIt01Person>({
    full_name: '',
    birth_date: '',
    address: '',
  });

  age = computed(() => {
    const birthYear = Number(this.form().birth_date.slice(0, 4));
    return birthYear ? new Date().getFullYear() - birthYear : null;
  });

  constructor(private it01: It01Service) {
    this.loadPeople();
  }

  loadPeople() {
    this.it01.getPeople().subscribe({
      next: (people) => this.people.set(people),
      error: () => this.people.set([]),
    });
  }

  openAdd() {
    this.form.set({ full_name: '', birth_date: '', address: '' });
    this.addOpen.set(true);
  }

  closeAdd() {
    this.addOpen.set(false);
  }

  updateForm(field: keyof CreateIt01Person, value: string) {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  save() {
    const body = {
      full_name: this.form().full_name.trim(),
      birth_date: this.form().birth_date,
      address: this.form().address.trim(),
    };

    if (!body.full_name || !body.birth_date || !body.address) {
      alert('Please complete all fields');
      return;
    }

    this.it01.createPerson(body).subscribe({
      next: (person) => {
        this.people.update((items) => [...items, person]);
        this.closeAdd();
      },
      error: (err) => alert(err?.error?.error || 'Save failed'),
    });
  }

  openView(person: It01Person) {
    this.viewing.set(person);
  }

  closeView() {
    this.viewing.set(null);
  }

  formatBirthDate(value: string) {
    const apiDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (apiDate) return `${apiDate[3]}/${apiDate[2]}/${apiDate[1]}`;

    return value;
  }
}

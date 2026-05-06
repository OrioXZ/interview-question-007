import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreateIt04Profile } from '../../models/it04-profile.model';
import { It04Service } from '../../services/it04.service';

@Component({
  selector: 'app-it04',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './it04.html',
  styleUrls: ['./it04.scss'],
})
export class It04Component {
  @ViewChild('profileInput') profileInput?: ElementRef<HTMLInputElement>;

  occupations = ['Developer', 'Designer', 'IT Support', 'Accountant', 'Manager'];
  form = signal<CreateIt04Profile>(this.emptyForm());
  message = signal('');
  savedId = signal<number | null>(null);

  constructor(private it04: It04Service) {}

  updateForm(field: keyof CreateIt04Profile, value: string) {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  onProfileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.updateForm('profile_image_base64', '');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.updateForm('profile_image_base64', String(reader.result ?? ''));
    reader.readAsDataURL(file);
  }

  save() {
    const body = this.trimmedForm();
    const validationError = this.validate(body);
    if (validationError) {
      alert(validationError);
      return;
    }

    this.it04.createProfile(body).subscribe({
      next: (profile) => {
        this.savedId.set(profile.id);
        this.message.set('save data success');
        this.clear(false);
      },
      error: (err) => alert(err?.error?.error || 'Save failed'),
    });
  }

  clear(clearMessage = true) {
    this.form.set(this.emptyForm());
    if (this.profileInput) this.profileInput.nativeElement.value = '';
    if (clearMessage) {
      this.message.set('');
      this.savedId.set(null);
    }
  }

  private emptyForm(): CreateIt04Profile {
    return {
      full_name: '',
      email: '',
      phone: '',
      birth_day: '',
      occupation: '',
      profile_image_base64: '',
    };
  }

  private trimmedForm(): CreateIt04Profile {
    const current = this.form();
    return {
      full_name: current.full_name.trim(),
      email: current.email.trim(),
      phone: current.phone.trim(),
      birth_day: current.birth_day,
      occupation: current.occupation,
      profile_image_base64: current.profile_image_base64,
    };
  }

  private validate(body: CreateIt04Profile) {
    if (!body.full_name || !body.email || !body.phone || !body.birth_day || !body.occupation || !body.profile_image_base64) {
      return 'Please complete all fields';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return 'Invalid email format';
    }

    if (!/^\+?[0-9][0-9\s\-()]{7,24}$/.test(body.phone)) {
      return 'Invalid phone format';
    }

    return '';
  }
}

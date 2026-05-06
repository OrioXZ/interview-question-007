import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { It02LoginBody, It02RegisterBody } from '../../models/it02-auth.model';
import { It02Service } from '../../services/it02.service';

type It02Page = 'login' | 'register' | 'success';

@Component({
  selector: 'app-it02',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './it02.html',
  styleUrls: ['./it02.scss'],
})
export class It02Component {
  page = signal<It02Page>('login');
  loading = signal(false);
  loggedInUsername = signal('');
  token = signal('');
  loginForm = signal<It02LoginBody>(this.emptyLoginForm());
  registerForm = signal<It02RegisterBody>(this.emptyRegisterForm());

  constructor(private readonly it02: It02Service) {}

  updateLogin(field: keyof It02LoginBody, value: string) {
    this.loginForm.update((current) => ({ ...current, [field]: value }));
  }

  updateRegister(field: keyof It02RegisterBody, value: string) {
    this.registerForm.update((current) => ({ ...current, [field]: value }));
  }

  showRegister() {
    this.registerForm.set(this.emptyRegisterForm());
    this.page.set('register');
  }

  showLogin() {
    this.loginForm.set(this.emptyLoginForm());
    this.page.set('login');
  }

  register() {
    if (this.loading()) return;

    const body = this.trimRegisterForm();
    if (!body.username || !body.password || !body.confirm_password) {
      alert('Please complete all fields');
      return;
    }
    if (body.password !== body.confirm_password) {
      alert('Password and confirm password must match');
      return;
    }

    this.loading.set(true);
    this.it02.register(body).subscribe({
      next: () => {
        this.loading.set(false);
        this.showLogin();
      },
      error: (err) => {
        alert(err?.error?.error || 'Register failed');
        this.loading.set(false);
      },
    });
  }

  login() {
    if (this.loading()) return;

    const body = this.trimLoginForm();
    if (!body.username || !body.password) {
      alert('Please enter username and password');
      return;
    }

    this.loading.set(true);
    this.it02.login(body).subscribe({
      next: (response) => {
        this.token.set(response.token);
        this.validateToken(response.token);
      },
      error: (err) => {
        alert(err?.error?.error || 'Login failed');
        this.loading.set(false);
      },
    });
  }

  private validateToken(token: string) {
    this.it02.currentUser(token).subscribe({
      next: (user) => {
        this.loggedInUsername.set(user.username);
        this.page.set('success');
        this.loading.set(false);
      },
      error: (err) => {
        alert(err?.error?.error || 'Token validation failed');
        this.loading.set(false);
      },
    });
  }

  private emptyLoginForm(): It02LoginBody {
    return { username: '', password: '' };
  }

  private emptyRegisterForm(): It02RegisterBody {
    return { username: '', password: '', confirm_password: '' };
  }

  private trimLoginForm(): It02LoginBody {
    const current = this.loginForm();
    return {
      username: current.username.trim(),
      password: current.password,
    };
  }

  private trimRegisterForm(): It02RegisterBody {
    const current = this.registerForm();
    return {
      username: current.username.trim(),
      password: current.password,
      confirm_password: current.confirm_password,
    };
  }
}

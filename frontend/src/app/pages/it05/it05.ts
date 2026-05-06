import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { It05Service } from '../../services/it05.service';

type QueuePage = 'home' | 'ticket' | 'cleared';

@Component({
  selector: 'app-it05',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './it05.html',
  styleUrls: ['./it05.scss'],
})
export class It05Component {
  page = signal<QueuePage>('home');
  queueNumber = signal('');
  loading = signal(false);

  constructor(private it05: It05Service) {
    this.loadCurrentQueue();
  }

  loadCurrentQueue() {
    this.it05.currentQueue().subscribe({
      next: (res) => this.queueNumber.set(res.queue_number),
      error: () => this.queueNumber.set('00'),
    });
  }

  getQueue() {
    if (this.loading()) return;

    this.loading.set(true);
    this.it05.nextQueue().subscribe({
      next: (res) => {
        this.queueNumber.set(res.queue_number);
        this.page.set('ticket');
        this.loading.set(false);
      },
      error: (err) => {
        alert(err?.error?.error || 'Get queue failed');
        this.loading.set(false);
      },
    });
  }

  clearQueue() {
    if (this.loading()) return;

    this.loading.set(true);
    this.it05.clearQueue().subscribe({
      next: (res) => {
        this.queueNumber.set(res.queue_number);
        this.page.set('cleared');
        this.loading.set(false);
      },
      error: (err) => {
        alert(err?.error?.error || 'Clear queue failed');
        this.loading.set(false);
      },
    });
  }

  backHome() {
    this.loadCurrentQueue();
    this.page.set('home');
  }
}

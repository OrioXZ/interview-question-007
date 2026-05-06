import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { It08Question } from '../../models/it08-question.model';
import { It08Service } from '../../services/it08.service';

@Component({
  selector: 'app-it08',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './it08.html',
  styleUrls: ['./it08.scss'],
})
export class It08Component {
  questions = signal<It08Question[]>([]);
  adding = signal(false);
  text = signal('');

  constructor(private it08: It08Service) {
    this.loadQuestions();
  }

  loadQuestions() {
    this.it08.getQuestions().subscribe({
      next: (questions) => this.questions.set(questions),
      error: () => this.questions.set([]),
    });
  }

  openAdd() {
    this.text.set('');
    this.adding.set(true);
  }

  cancel() {
    this.text.set('');
    this.adding.set(false);
  }

  save() {
    const text = this.text().trim();
    if (!text) {
      alert('Please enter question data');
      return;
    }

    this.it08.createQuestion(text).subscribe({
      next: () => {
        this.cancel();
        this.loadQuestions();
      },
      error: (err) => alert(err?.error?.error || 'Save failed'),
    });
  }

  deleteQuestion(question: It08Question) {
    if (!confirm(`Delete question ${question.question_no}?`)) return;

    this.it08.deleteQuestion(question.id).subscribe({
      next: () => this.loadQuestions(),
      error: (err) => alert(err?.error?.error || 'Delete failed'),
    });
  }
}

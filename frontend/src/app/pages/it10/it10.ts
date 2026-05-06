import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { It10ExamResult, It10Question } from '../../models/it10-exam.model';
import { It10Service } from '../../services/it10.service';

@Component({
  selector: 'app-it10',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './it10.html',
  styleUrls: ['./it10.scss'],
})
export class It10Component {
  questions = signal<It10Question[]>([]);
  testerName = signal('');
  answers = signal<Record<number, number>>({});
  result = signal<It10ExamResult | null>(null);

  constructor(private it10: It10Service) {
    this.loadQuestions();
  }

  loadQuestions() {
    this.it10.getQuestions().subscribe({
      next: (questions) => this.questions.set(questions),
      error: () => this.questions.set([]),
    });
  }

  selectAnswer(questionId: number, optionId: number) {
    this.answers.update((current) => ({ ...current, [questionId]: optionId }));
  }

  submit() {
    const testerName = this.testerName().trim();
    if (!testerName) {
      alert('Please enter tester name');
      return;
    }

    const questions = this.questions();
    if (Object.keys(this.answers()).length !== questions.length) {
      alert('Please answer every question');
      return;
    }

    const answers = questions.map((question) => ({
      question_id: question.id,
      option_id: this.answers()[question.id],
    }));

    this.it10.submitExam(testerName, answers).subscribe({
      next: (result) => this.result.set(result),
      error: (err) => alert(err?.error?.error || 'Submit failed'),
    });
  }

  takeAgain() {
    this.testerName.set('');
    this.answers.set({});
    this.result.set(null);
  }
}

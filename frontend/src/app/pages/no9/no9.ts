import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { No9Comment } from '../../models/no9-comment.model';
import { No9CommentService } from '../../services/no9-comment.service';

@Component({
  selector: 'app-no9',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './no9.html',
  styleUrls: ['./no9.scss'],
})
export class No9Component {
  readonly commenter = 'Blend 285';
  comments = signal<No9Comment[]>([]);
  message = signal('');

  constructor(private commentService: No9CommentService) {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments().subscribe({
      next: (comments) => this.comments.set(comments),
      error: () => this.comments.set([]),
    });
  }

  saveOnEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) return;

    keyboardEvent.preventDefault();
    this.saveComment();
  }

  saveComment() {
    const message = this.message().trim();
    if (!message) return;

    this.commentService.createComment(message).subscribe({
      next: (comment) => {
        this.comments.update((items) => [...items, comment]);
        this.message.set('');
      },
      error: (err) => alert(err?.error?.error || 'Save comment failed'),
    });
  }
}

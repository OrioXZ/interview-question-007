import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { It09Comment } from '../../models/it09-comment.model';
import { It09CommentService } from '../../services/it09-comment.service';

@Component({
  selector: 'app-it09',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './it09.html',
  styleUrls: ['./it09.scss'],
})
export class It09Component {
  readonly commenter = 'Blend 285';
  comments = signal<It09Comment[]>([]);
  message = signal('');

  constructor(private commentService: It09CommentService) {
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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TaskLink {
  number: string;
  title: string;
  path: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
})
export class LandingComponent {
  readonly tasks: TaskLink[] = [
    { number: 'IT01', title: 'Personal Info', path: '/it01' },
    { number: 'IT02', title: 'Login and Register', path: '/it02' },
    { number: 'IT03', title: 'Approval Requests', path: '/it03' },
    { number: 'IT04', title: 'Profile Form', path: '/it04' },
    { number: 'IT05', title: 'Queue Ticket', path: '/it05' },
    { number: 'IT06', title: 'Barcode Product Codes', path: '/it06' },
    { number: 'IT07', title: 'QR Product Codes', path: '/it07' },
    { number: 'IT08', title: 'Question List', path: '/it08' },
    { number: 'IT09', title: 'Comments', path: '/it09' },
    { number: 'IT10', title: 'Exam', path: '/it10' },
  ];
}

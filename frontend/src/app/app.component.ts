import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="p-3 border-b flex gap-3">
      <a routerLink="/timeline">Timeline</a>
      <a routerLink="/register">Register</a>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  
}



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span class="font-bold">Golive Management</span>
      <span class="flex-1"></span>
      <a mat-button routerLink="/timeline">Timeline</a>
      <a mat-button routerLink="/register">Register</a>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  
}



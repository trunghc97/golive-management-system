import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule
    ],
    template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button (click)="drawer.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="app-title">Go-Live Management System</span>
    </mat-toolbar>

    <mat-sidenav-container class="app-container">
      <mat-sidenav #drawer mode="side" opened class="app-sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/changes" routerLinkActive="active">
            <mat-icon matListItemIcon>change_circle</mat-icon>
            <span matListItemTitle>Change Requests</span>
          </a>
          <a mat-list-item routerLink="/services" routerLinkActive="active">
            <mat-icon matListItemIcon>apps</mat-icon>
            <span matListItemTitle>Service Catalog</span>
          </a>
          <a mat-list-item routerLink="/impact-analysis" routerLinkActive="active">
            <mat-icon matListItemIcon>account_tree</mat-icon>
            <span matListItemTitle>Impact Analysis</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="app-content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
    styles: [`
    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-title {
      font-size: 1.25rem;
      font-weight: 500;
      margin-left: 1rem;
    }

    .app-container {
      position: fixed;
      top: 64px;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .app-sidenav {
      width: 250px;
      border-right: 1px solid rgba(0,0,0,0.12);
    }

    .app-content {
      padding: 2rem;
      background: #f5f5f5;
      overflow: auto;
    }

    mat-nav-list a.active {
      background: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }

    mat-nav-list a:hover {
      background: rgba(0,0,0,0.04);
    }
  `]
})
export class AppComponent {
    title = 'Go-Live Management System';
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatTabsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <mat-toolbar color="primary" class="sticky top-0 z-10">
        <mat-icon>timeline</mat-icon>
        <span class="font-bold ml-2">Golive Management</span>
        <span class="flex-1"></span>
        <button mat-button (click)="goRegister()"><mat-icon>add_circle</mat-icon> Đăng ký</button>
      </mat-toolbar>

      <div class="container mx-auto px-4 py-4">
        <mat-tab-group class="shadow-sm rounded bg-white" mat-stretch-tabs [selectedIndex]="tabIndex" (selectedIndexChange)="onTabChange($event)">
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="mr-1">list</mat-icon> Changes
            </ng-template>
          </mat-tab>
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="mr-1">schedule</mat-icon> Timeline
            </ng-template>
          </mat-tab>
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="mr-1">view_list</mat-icon> Components
            </ng-template>
          </mat-tab>
        </mat-tab-group>

        <div class="mt-4">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  constructor(private router: Router) {
    const setIndex = (url: string) => {
      const found = this.tabRoutes.findIndex(r => url.startsWith(r));
      this.tabIndex = found >= 0 ? found : this.tabIndex;
    };
    setIndex(window.location.pathname);
    this.router.events.pipe(filter((e: any) => e?.constructor?.name === 'NavigationEnd')).subscribe((e: any) => setIndex(e.urlAfterRedirects || e.url));
  }
  tabRoutes = ['/dashboard/changes', '/dashboard/timeline', '/dashboard/components'];
  tabIndex = 0;

  onTabChange(idx: number) {
    const route = this.tabRoutes[idx] || this.tabRoutes[1];
    this.router.navigateByUrl(route);
  }

  goRegister() {
    this.router.navigateByUrl('/register');
  }
}



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardDay, DashboardWeek, ChangeRequest } from '../../models/models';
import { format, startOfWeek } from 'date-fns';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatExpansionModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="dashboard-container">
      <h1>Go-Live Timeline</h1>

      <mat-card class="controls-card">
        <mat-button-toggle-group [(ngModel)]="viewMode" (change)="onViewModeChange()">
          <mat-button-toggle value="day">Day View</mat-button-toggle>
          <mat-button-toggle value="week">Week View</mat-button-toggle>
        </mat-button-toggle-group>

        <mat-form-field appearance="outline" class="date-picker">
          <mat-label>Select Date</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate" (dateChange)="onDateChange()">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </mat-card>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading && viewMode === 'day' && dayData" class="day-view">
        <mat-card class="summary-card">
          <h2>{{ dayData.date | date:'fullDate' }}</h2>
          <div class="summary-stats">
            <mat-chip>{{ dayData.totalChanges }} Changes</mat-chip>
            <mat-chip>{{ dayData.totalDeployments }} Deployments</mat-chip>
          </div>
        </mat-card>

        <div class="changes-list">
          <mat-expansion-panel *ngFor="let change of dayData.changes" class="change-panel">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <strong>{{ change.changeCode }}</strong> - {{ change.title }}
              </mat-panel-title>
              <mat-panel-description>
                <mat-chip [class]="'status-' + change.status.toLowerCase()">{{ change.status }}</mat-chip>
                {{ change.plannedStart | date:'shortTime' }} - {{ change.plannedEnd | date:'shortTime' }}
              </mat-panel-description>
            </mat-expansion-panel-header>

            <div class="change-details">
              <p><strong>System:</strong> {{ change.systemName }}</p>
              <p><strong>Requester:</strong> {{ change.requester }}</p>
              <p><strong>Environment:</strong> {{ change.environment }}</p>
              <p *ngIf="change.description">{{ change.description }}</p>

              <h4 *ngIf="change.deployments && change.deployments.length > 0">Service Deployments:</h4>
              <ul class="deployments-list">
                <li *ngFor="let deployment of change.deployments">
                  <strong>{{ deployment.serviceCode }}</strong> - {{ deployment.serviceName }}
                  <br>Version: {{ deployment.deployVersion }}
                  <mat-chip [class]="'status-' + deployment.status.toLowerCase()">{{ deployment.status }}</mat-chip>
                </li>
              </ul>
            </div>
          </mat-expansion-panel>
        </div>
      </div>

      <div *ngIf="!loading && viewMode === 'week' && weekData" class="week-view">
        <mat-card class="summary-card">
          <h2>Week of {{ weekData.weekStart | date:'mediumDate' }}</h2>
          <div class="summary-stats">
            <mat-chip>{{ weekData.totalChanges }} Changes</mat-chip>
            <mat-chip>{{ weekData.totalDeployments }} Deployments</mat-chip>
          </div>
        </mat-card>

        <div class="week-days">
          <mat-card *ngFor="let day of weekData.days" class="day-card">
            <h3>{{ day.date | date:'EEE, MMM d' }}</h3>
            <div class="day-summary">
              <span>{{ day.totalChanges }} changes</span>
              <span>{{ day.totalDeployments }} deployments</span>
            </div>
            <div class="day-changes">
              <div *ngFor="let change of day.changes" class="change-item">
                <strong>{{ change.changeCode }}</strong>
                <span class="change-time">{{ change.plannedStart | date:'shortTime' }}</span>
                <mat-chip [class]="'status-' + change.status.toLowerCase()">{{ change.status }}</mat-chip>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .controls-card {
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .date-picker {
      min-width: 200px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    .summary-card {
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-stats {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .changes-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .change-panel {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .change-details {
      padding: 1rem;
    }

    .deployments-list {
      list-style: none;
      padding: 0;
    }

    .deployments-list li {
      padding: 0.5rem;
      margin: 0.5rem 0;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .week-days {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .day-card {
      padding: 1rem;
    }

    .day-summary {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: #666;
      margin: 0.5rem 0;
    }

    .day-changes {
      margin-top: 1rem;
    }

    .change-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.5rem;
      margin: 0.5rem 0;
      background: #f9f9f9;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .change-time {
      color: #666;
      font-size: 0.75rem;
    }

    mat-chip {
      font-size: 0.75rem;
      height: 24px;
    }

    .status-draft { background: #9e9e9e; color: white; }
    .status-approved { background: #2196f3; color: white; }
    .status-in_progress { background: #ff9800; color: white; }
    .status-completed { background: #4caf50; color: white; }
    .status-cancelled { background: #f44336; color: white; }
    .status-rolled_back { background: #9c27b0; color: white; }
    .status-pending { background: #9e9e9e; color: white; }
    .status-success { background: #4caf50; color: white; }
    .status-failed { background: #f44336; color: white; }
  `]
})
export class DashboardComponent implements OnInit {
    viewMode: 'day' | 'week' = 'day';
    selectedDate: Date = new Date();
    loading = false;
    dayData: DashboardDay | null = null;
    weekData: DashboardWeek | null = null;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.loadData();
    }

    onViewModeChange() {
        this.loadData();
    }

    onDateChange() {
        this.loadData();
    }

    loadData() {
        this.loading = true;

        if (this.viewMode === 'day') {
            const dateStr = format(this.selectedDate, 'yyyy-MM-dd');
            this.dashboardService.getDayView(dateStr).subscribe({
                next: (data) => {
                    this.dayData = data;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading day view:', err);
                    this.loading = false;
                }
            });
        } else {
            const weekStart = startOfWeek(this.selectedDate, { weekStartsOn: 1 });
            const dateStr = format(weekStart, 'yyyy-MM-dd');
            this.dashboardService.getWeekView(dateStr).subscribe({
                next: (data) => {
                    this.weekData = data;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading week view:', err);
                    this.loading = false;
                }
            });
        }
    }
}

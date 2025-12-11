import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChangeService } from '../../services/change.service';
import { ChangeRequest } from '../../models/models';

@Component({
    selector: 'app-change-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule
    ],
    template: `
    <div class="change-list-container">
      <h1>Change Requests</h1>

      <table mat-table [dataSource]="changes" class="changes-table">
        <ng-container matColumnDef="changeCode">
          <th mat-header-cell *matHeaderCellDef>Code</th>
          <td mat-cell *matCellDef="let change">{{ change.changeCode }}</td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let change">{{ change.title }}</td>
        </ng-container>

        <ng-container matColumnDef="system">
          <th mat-header-cell *matHeaderCellDef>System</th>
          <td mat-cell *matCellDef="let change">{{ change.systemName }}</td>
        </ng-container>

        <ng-container matColumnDef="plannedStart">
          <th mat-header-cell *matHeaderCellDef>Planned Start</th>
          <td mat-cell *matCellDef="let change">{{ change.plannedStart | date:'short' }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let change">
            <mat-chip [class]="'status-' + change.status.toLowerCase()">{{ change.status }}</mat-chip>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
    styles: [`
    .change-list-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .changes-table {
      width: 100%;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    th {
      font-weight: 600;
      background: #f5f5f5;
    }

    .status-draft { background: #9e9e9e; color: white; }
    .status-approved { background: #2196f3; color: white; }
    .status-in_progress { background: #ff9800; color: white; }
    .status-completed { background: #4caf50; color: white; }
    .status-cancelled { background: #f44336; color: white; }
    .status-rolled_back { background: #9c27b0; color: white; }
  `]
})
export class ChangeListComponent implements OnInit {
    changes: ChangeRequest[] = [];
    displayedColumns = ['changeCode', 'title', 'system', 'plannedStart', 'status'];

    constructor(private changeService: ChangeService) { }

    ngOnInit() {
        this.loadChanges();
    }

    loadChanges() {
        this.changeService.getAllChanges().subscribe({
            next: (data) => {
                this.changes = data;
            },
            error: (err) => console.error('Error loading changes:', err)
        });
    }
}

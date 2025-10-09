import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-history',
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatChipsModule, MatTooltipModule],
  template: `
    <div class="p-4">
      <mat-card class="shadow-md">
        <mat-card-title>
          <span class="inline-flex items-center gap-2">
            <mat-icon color="primary">history</mat-icon>
            Lịch sử thay đổi: <span class="font-mono">{{ changeId }}</span>
          </span>
        </mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="data()" class="w-full">
            <ng-container matColumnDef="time">
              <th mat-header-cell *matHeaderCellDef> Thời gian </th>
              <td mat-cell *matCellDef="let h">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-gray-500">schedule</mat-icon>
                  {{ h.actionTime | date:'yyyy-MM-dd HH:mm' }}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="component">
              <th mat-header-cell *matHeaderCellDef> Component </th>
              <td mat-cell *matCellDef="let h">
                <mat-chip-set>
                  <mat-chip color="primary" selected>{{ h.componentCode }}</mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef> Hành động </th>
              <td mat-cell *matCellDef="let h">
                <mat-chip [color]="chipColor(h.action)" selected>{{ h.action }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actor">
              <th mat-header-cell *matHeaderCellDef> Thực hiện </th>
              <td mat-cell *matCellDef="let h">
                <div class="inline-flex items-center gap-1">
                  <mat-icon>person</mat-icon>
                  {{ h.actor }}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="notes">
              <th mat-header-cell *matHeaderCellDef> Ghi chú </th>
              <td mat-cell *matCellDef="let h">
                <span [matTooltip]="h.notes" class="truncate max-w-[320px] block">{{ h.notes || '-' }}</span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  changeId = this.route.snapshot.paramMap.get('changeId') || '';
  data = signal<any[]>([]);
  cols = ['time','component','action','actor','notes'];

  ngOnInit() {
    this.api.getHistory(this.changeId).subscribe(d => this.data.set(d as any[]));
  }

  chipColor(action: string): 'primary' | 'accent' | 'warn' {
    if (!action) return 'primary';
    if (action.startsWith('ROLLBACK')) return 'warn';
    if (action === 'GOLIVE' || action === 'UPDATE') return 'accent';
    return 'primary';
  }
}



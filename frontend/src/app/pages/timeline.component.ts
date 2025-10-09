import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChangeDetailDialog } from '../components/changes-list/changes-list.component';

@Component({
  standalone: true,
  selector: 'app-timeline',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule, ChangeDetailDialog],
  template: `
    <div class="p-4">
      <mat-card class="shadow-md">
        <mat-card-title>
          <span class="inline-flex items-center gap-2">
            <mat-icon color="primary">timeline</mat-icon>
            Timeline tổng quan
          </span>
        </mat-card-title>
        <mat-card-content>
          <div class="mb-2 flex gap-2 items-center">
            <input type="date" [value]="today" (change)="onDate($event)" class="border px-2 py-1 rounded" />
            <button mat-flat-button color="primary" (click)="load()">
              <mat-icon>refresh</mat-icon>
              Tải lại
            </button>
          </div>
          <div class="text-xs text-gray-500 mb-3">Khoảng: 18:00 hôm trước → 05:00 hôm sau</div>
          <div class="space-y-4">
            <div *ngFor="let row of data()">
              <div class="font-medium mb-1 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" [ngStyle]="{background: colorOfRow(row)}"></span>
                {{ row.component }}
              </div>
              <div class="relative h-12">
                <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-300 rounded"></div>
                <div *ngFor="let ch of row.changes"
                     class="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                     [style.left.%]="pos(ch.startTime)"
                     [style.top.%]="50"
                     [matTooltip]="tooltip(ch)"
                     (click)="openDetail(ch)">
                  <div class="w-3 h-3 rounded-full" [ngStyle]="{background: color(ch.status), border: ch.conflict ? '2px solid #ef4444' : 'none'}"></div>
                </div>
              </div>
              <div class="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>18:00</span>
                <span>00:00</span>
                <span>05:00</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class TimelineComponent implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  data = signal<any[]>([]);
  today = new Date().toISOString().slice(0,10);

  ngOnInit() { this.load(); }

  onDate(e: any) { this.today = e.target.value; }

  load() {
    this.api.getTimeline(this.today).subscribe(d => this.data.set(d as any[]));
  }

  colorOfRow(row: any) {
    const hasRollback = (row.changes || []).some((c: any) => (c.status || '').startsWith('ROLLBACK'));
    const hasConflict = row.hasConflict === true || (row.changes || []).some((c: any) => c.conflict);
    if (hasConflict) return '#ef4444';
    if (hasRollback) return '#f59e0b';
    return '#9ca3af';
  }

  pos(start: string): number {
    const t = new Date(start);
    const logicalStart = new Date(t);
    logicalStart.setDate(logicalStart.getHours() < 6 ? logicalStart.getDate() - 1 : logicalStart.getDate());
    logicalStart.setHours(18, 0, 0, 0);
    const logicalEnd = new Date(logicalStart);
    logicalEnd.setHours(29, 0, 0, 0);
    const total = logicalEnd.getTime() - logicalStart.getTime();
    const x = t.getTime() - logicalStart.getTime();
    return Math.max(0, Math.min(100, (x / total) * 100));
  }

  openDetail(ch: any) {
    this.dialog.open(ChangeDetailDialog, { data: ch, width: '520px' });
  }
}



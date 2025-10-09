import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TimelineService } from '../../services/timeline.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChangeDetailDialog } from '../changes-list/changes-list.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-timeline-day',
  imports: [CommonModule, MatCardModule, MatTooltipModule, MatDialogModule, MatIconModule, ChangeDetailDialog],
  template: `
    <div class="p-4">
      <mat-card class="shadow-md">
        <mat-card-title><mat-icon class="mr-2">schedule</mat-icon> Change Golive Theo Ngày</mat-card-title>
        <mat-card-content>
          <div class="mb-3">
            <input type="date" [value]="day" (change)="onDay($event)" class="border px-2 py-1" />
          </div>
          <div class="text-xs text-gray-500 mb-2">Trục thời gian: 18h → 05h</div>
          <div *ngFor="let r of rows()" class="mb-4">
            <div class="font-medium mb-1 flex items-center" [class.text-red-600]="r.hasConflict">
              <span class="w-2 h-2 rounded-full mr-2" [ngStyle]="{background: r.hasConflict ? '#ef4444' : '#9ca3af'}"></span>
              {{ r.componentName }}
            </div>
            <div class="relative h-10 border-b bg-gray-50 rounded">
              <ng-container *ngFor="let ch of r.changes">
                <div class="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110" matTooltipPosition="above" [matTooltip]="tooltip(ch)" (click)="openDetail(ch)"
                     [style.left.%]="pos(ch.startTime)"
                     [ngStyle]="{ width: '10px', height: '10px', borderRadius: '9999px', background: color(ch.status), border: r.hasConflict ? '2px solid red' : 'none' }"></div>
              </ng-container>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class TimelineDayComponent implements OnInit {
  private api = inject(TimelineService);
  private dialog = inject(MatDialog);
  rows = signal<any[]>([]);
  day = new Date().toISOString().slice(0,10);

  ngOnInit() { this.load(); }
  onDay(e: any) { this.day = e.target.value; this.load(); }

  load() {
    this.api.getDay(this.day).subscribe((res: any) => this.rows.set(res.components || []));
  }

  pos(start: string): number {
    const t = new Date(start);
    // logical range: previous day 18:00 to next day 05:00 (11 hours total)
    const startDay = new Date(t);
    startDay.setDate(startDay.getHours() < 6 ? startDay.getDate()-1 : startDay.getDate());
    startDay.setHours(18,0,0,0);
    const endDay = new Date(startDay); endDay.setHours(29,0,0,0); // 18:00 + 11h = 05:00 next day
    const totalMs = endDay.getTime() - startDay.getTime();
    const posMs = new Date(start).getTime() - startDay.getTime();
    return Math.max(0, Math.min(100, (posMs / totalMs) * 100));
  }

  color(status: string) {
    if (!status || status === 'PENDING') return '#9ca3af'; // gray
    if (status === 'IN_PROGRESS') return '#3b82f6'; // blue
    if (status === 'SUCCESS') return '#22c55e'; // green
    if (status?.startsWith('ROLLBACK')) return '#f59e0b'; // orange
    return '#ef4444'; // red
  }

  tooltip(ch: any) {
    return `${ch.changeId} | ${ch.team} | ${ch.registeredBy}\n${new Date(ch.startTime).toLocaleString()} - ${new Date(ch.endTime).toLocaleString()} | ${ch.status}`;
  }

  openDetail(ch: any) {
    this.dialog.open(ChangeDetailDialog, { data: ch, width: '520px' });
  }
}



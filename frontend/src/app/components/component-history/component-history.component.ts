import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ComponentService } from '../../services/component.service';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChangeDetailDialog } from '../changes-list/changes-list.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-component-history',
  imports: [CommonModule, MatCardModule, FormsModule, MatDialogModule, MatIconModule, ChangeDetailDialog],
  template: `
    <div class="p-4">
      <mat-card class="shadow-md">
        <mat-card-title><mat-icon class="mr-2">view_list</mat-icon> Danh sách Cấu phần Golive (Theo Tháng)</mat-card-title>
        <mat-card-content>
          <div class="flex gap-2 mb-3">
            <input type="date" [(ngModel)]="from" class="border px-2 py-1" />
            <input type="date" [(ngModel)]="to" class="border px-2 py-1" />
            <button class="border px-3 py-1" (click)="load()">Tải</button>
          </div>
          <div class="grid md:grid-cols-2 gap-3">
            <div *ngFor="let c of data()" class="border rounded p-3 hover:shadow transition-shadow" [ngStyle]="styleCard(c)">
              <div class="font-semibold mb-2">{{ c.component }}</div>
              <div class="flex flex-col gap-1">
                <div *ngFor="let t of c.timeline" class="text-sm cursor-pointer" (click)="openDetail(t)">
                  <span [ngStyle]="{color: color(t.status)}">●</span>
                  {{ t.date }} - {{ t.changeId }} - {{ t.status }}
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ComponentHistoryComponent implements OnInit {
  private api = inject(ComponentService);
  private dialog = inject(MatDialog);
  data = signal<any[]>([]);
  from = new Date(new Date().setMonth(new Date().getMonth()-1)).toISOString().slice(0,10);
  to = new Date().toISOString().slice(0,10);

  ngOnInit() { this.load(); }
  load() { this.api.getSummary(this.from, this.to).subscribe(d => this.data.set(d)); }

  color(status: string) {
    if (!status || status === 'PENDING') return '#9ca3af';
    if (status === 'IN_PROGRESS') return '#3b82f6';
    if (status === 'SUCCESS') return '#22c55e';
    if (status?.startsWith('ROLLBACK')) return '#f59e0b';
    return '#ef4444';
  }
  styleCard(c: any) {
    const hasRollback = (c.timeline || []).some((t: any) => (t.status || '').startsWith('ROLLBACK'));
    // Conflict style requires extra flag; approximate by presence of multiple same-date changes
    const hasConflict = false;
    return {
      border: hasConflict ? '2px solid red' : hasRollback ? '2px solid orange' : '1px solid #e5e7eb'
    };
  }

  openDetail(t: any) {
    // map summary node to dialog data shape (no team/registeredBy in summary; pass minimal)
    const data = {
      changeId: t.changeId,
      team: '-',
      registeredBy: '-',
      status: t.status,
      startTime: t.date,
      endTime: t.date,
      description: ''
    };
    this.dialog.open(ChangeDetailDialog, { data, width: '520px' });
  }
}



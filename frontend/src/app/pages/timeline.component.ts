import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-timeline',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="p-4">
      <mat-card>
        <mat-card-title>Timeline</mat-card-title>
        <mat-card-content>
          <div class="mb-2 flex gap-2 items-center">
            <input type="date" [value]="today" (change)="onDate($event)" class="border px-2 py-1" />
            <button mat-raised-button color="primary" (click)="load()">Reload</button>
          </div>
          <div class="text-xs text-gray-500 mb-2">Khoảng: 18:00 hôm trước → 05:00 hôm sau</div>
          <div *ngFor="let row of data()" class="mb-3">
            <div class="font-medium mb-1">{{ row.component }}</div>
            <div class="flex gap-1 flex-wrap">
              <div *ngFor="let ch of row.changes"
                   class="px-2 py-1 text-xs rounded"
                   [ngClass]="{
                     'bg-green-200': ch.status==='SUCCESS',
                     'bg-red-200': ch.conflict,
                     'bg-orange-200': ch.status?.startsWith('ROLLBACK'),
                     'bg-gray-200': !ch.status || ch.status==='PENDING'
                   }">
                {{ ch.changeId }} ({{ ch.startTime | date:'HH:mm' }}-{{ ch.endTime | date:'HH:mm' }})
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
  data = signal<any[]>([]);
  today = new Date().toISOString().slice(0,10);

  ngOnInit() { this.load(); }

  onDate(e: any) { this.today = e.target.value; }

  load() {
    this.api.getTimeline(this.today).subscribe(d => this.data.set(d as any[]));
  }
}



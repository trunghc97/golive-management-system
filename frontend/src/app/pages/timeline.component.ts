import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-timeline',
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-lg font-semibold mb-3">Timeline</h2>
      <div class="mb-2 flex gap-2 items-center">
        <input type="date" [value]="today" (change)="onDate($event)" class="border px-2 py-1" />
        <button class="border px-3 py-1" (click)="load()">Reload</button>
      </div>
      <div class="text-xs text-gray-500 mb-2">Khoảng: 18:00 hôm trước → 05:00 hôm sau</div>
      <div *ngFor="let row of data()" class="mb-3">
        <div class="font-medium">{{ row.component }}</div>
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



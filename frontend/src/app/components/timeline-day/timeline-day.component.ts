import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimelineService } from '../../services/timeline.service';
import { TimelineNodeComponent } from './timeline-node.component';

@Component({
  standalone: true,
  selector: 'app-timeline-day-new',
  imports: [CommonModule, FormsModule, TimelineNodeComponent],
  template: `
    <div class="timeline-container p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Golive Timeline ({{ selectedDate | date:'dd/MM/yyyy' }})</h2>
        <div>
          <input type="date" [(ngModel)]="dateText" (change)="onDateChange()" />
          <button class="ml-2 border px-3 py-1 rounded" (click)="refresh()">⟳ Refresh</button>
        </div>
      </div>

      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span *ngFor="let hour of hours">{{ hour }}</span>
      </div>
      <div class="border-b border-gray-400 mb-3"></div>

      <div *ngFor="let comp of timelineData" class="component-row flex items-center mb-4">
        <div class="w-40 font-medium text-sm">{{ comp.componentName }}</div>
        <div class="relative flex-grow border-b border-gray-300 h-6">
          <app-timeline-node
            *ngFor="let chg of comp.changes"
            [change]="chg"
            [timeRange]="timeRange"
            [hasConflict]="comp.hasConflict">
          </app-timeline-node>
        </div>
      </div>

      <div class="legend mt-6 text-sm flex space-x-4">
        <div><span class="dot pending"></span> Pending</div>
        <div><span class="dot success"></span> Success</div>
        <div><span class="dot rollback"></span> Rollback</div>
        <div><span class="dot conflict"></span> Conflict</div>
      </div>
    </div>
  `,
  styles: [
    `.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px}`,
    `.dot.pending{background:#9e9e9e}`,
    `.dot.success{background:#43a047}`,
    `.dot.rollback{background:#fb8c00}`,
    `.dot.conflict{background:#e53935}`,
    `.timeline-node{transform:translateX(-50%);transition:transform .1s ease-in}`,
    `.timeline-node:hover{transform:translateX(-50%) scale(1.4)}`
  ]
})
export class TimelineDayNewComponent implements OnInit {
  private api = inject(TimelineService);

  selectedDate = new Date();
  dateText = new Date().toISOString().slice(0,10);
  hours = ['18h','19h','20h','21h','22h','23h','00h','01h','02h','03h','04h','05h'];

  timeRange = { start: this.prevDayAt18h(), end: this.currDayAt05h() };
  timelineData: any[] = [];

  ngOnInit() { this.loadTimeline(); }

  onDateChange() {
    this.selectedDate = new Date(this.dateText);
    this.timeRange = { start: this.prevDayAt18h(), end: this.currDayAt05h() };
    this.loadTimeline();
  }

  refresh() { this.loadTimeline(); }

  loadTimeline() {
    const day = this.dateText;
    this.api.getDay(day).subscribe((res: any) => {
      this.timelineData = res.components || [];
    });
  }

  prevDayAt18h() {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() - 1);
    d.setHours(18,0,0,0);
    return d;
  }

  currDayAt05h() {
    const d = new Date(this.selectedDate);
    d.setHours(5,0,0,0);
    return d;
  }
}


